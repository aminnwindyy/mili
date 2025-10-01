// Lightweight mock data for demo when API_ORIGIN is not configured
// We import JSON so Wrangler bundles it with the function.
// Only keys the frontend actually needs are exposed.
// If you add new areas, extend the mocks map below.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import propertyJson from '../Entites/Property.json';
import investmentJson from '../Entites/Investment.json';
import userJson from '../Entites/User.json';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Proxy API requests to external origin if configured
  if (url.pathname.startsWith('/api/')) {
    const apiOrigin = env.API_ORIGIN?.toString().trim();
    if (!apiOrigin) {
      // Mock mode: serve fake responses for key endpoints
      // Normalize method
      const method = request.method.toUpperCase();

      // Only GET mocks for now
      if (method !== 'GET' && method !== 'OPTIONS') {
        return new Response('Mock mode: method not supported', { status: 405 });
      }

      // CORS preflight in mock mode
      if (method === 'OPTIONS') {
        const h = new Headers();
        const origin = request.headers.get('Origin') || '*';
        h.set('Access-Control-Allow-Origin', origin);
        h.set('Vary', 'Origin');
        h.set('Access-Control-Allow-Credentials', 'true');
        h.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || '*');
        h.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
        return new Response(null, { status: 204, headers: h });
      }

      // Route: /api/properties
      if (url.pathname === '/api/properties') {
        const body = JSON.stringify({ data: propertyJson.items || [] });
        return new Response(body, { status: 200, headers: corsHeaders(request) });
      }

      // Route: /api/investments
      if (url.pathname === '/api/investments') {
        const body = JSON.stringify({ data: investmentJson.items || [] });
        return new Response(body, { status: 200, headers: corsHeaders(request) });
      }

      // Route: /api/user-management/profile
      if (url.pathname === '/api/user-management/profile') {
        const body = JSON.stringify(userJson.me || null);
        return new Response(body, { status: 200, headers: corsHeaders(request) });
      }

      // Route: /api/notifications
      if (url.pathname === '/api/notifications') {
        const now = new Date();
        const sample = [
          { _id: 'n1', title: 'خرید موفق', message: '۱۰ توکن آپارتمان ولیعصر خریداری شد', created_date: now.toISOString(), read: false },
          { _id: 'n2', title: 'پرداخت تایید شد', message: 'مبلغ ۵۰۰,۰۰۰,۰۰۰ ریال تایید شد', created_date: new Date(now.getTime()-3600_000).toISOString(), read: true },
        ];
        return new Response(JSON.stringify({ data: sample }), { status: 200, headers: corsHeaders(request) });
      }

      // Route: /api/analytics/dashboard
      if (url.pathname === '/api/analytics/dashboard') {
        const payload = {
          total_investment: 10000000000,
          total_current_value: 12000000000,
          total_profit_loss: 2000000000,
          weekly_change_percent: 3.2,
          monthly_change_percent: 12.5,
        };
        return new Response(JSON.stringify(payload), { status: 200, headers: corsHeaders(request) });
      }

      // Route: /api/wallets
      if (url.pathname === '/api/wallets') {
        const wallets = [
          { id: 'wal-irt', currency: 'IRR', balance: 1500000000, available: 1200000000, locked: 300000000 },
        ];
        return new Response(JSON.stringify({ data: wallets }), { status: 200, headers: corsHeaders(request) });
      }

      // Route: /api/trefs (funds)
      if (url.pathname === '/api/trefs') {
        const trefs = [
          { id: 'tref-1', title: 'صندوق ملکی مسکونی تهران', expected_annual_return: 18.2, aum: 50000000000, status: 'باز' },
          { id: 'tref-2', title: 'صندوق تجاری کلانشهر', expected_annual_return: 20.1, aum: 82000000000, status: 'باز' },
        ];
        return new Response(JSON.stringify({ data: trefs }), { status: 200, headers: corsHeaders(request) });
      }

      // Secondary market endpoints
      if (url.pathname === '/api/secondary-market/ticker') {
        const payload = {
          last: 60_000_000,
          change24h: 1.8,
          high24h: 61_200_000,
          low24h: 58_900_000,
          volume24h: 1_250_000_000,
        };
        return new Response(JSON.stringify(payload), { status: 200, headers: corsHeaders(request) });
      }
      if (url.pathname === '/api/secondary-market/orderbook') {
        const mid = 60_000_000;
        const gen = (n, side) => Array.from({ length: n }).map((_, i) => ({
          price: side === 'ask' ? mid + (i + 1) * 200_000 : mid - (i + 1) * 200_000,
          size: Math.floor(5 + Math.random() * 120),
        }));
        const book = {
          bids: gen(10, 'bid'),
          asks: gen(10, 'ask'),
          mid,
        };
        return new Response(JSON.stringify(book), { status: 200, headers: corsHeaders(request) });
      }
      if (url.pathname === '/api/secondary-market/trades') {
        const now = Date.now();
        const trades = Array.from({ length: 12 }).map((_, i) => ({
          id: `t-${i}`,
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          price: 59_800_000 + Math.floor(Math.random() * 500_000),
          size: Math.floor(1 + Math.random() * 40),
          time: new Date(now - i * 60_000).toISOString(),
        }));
        return new Response(JSON.stringify({ data: trades }), { status: 200, headers: corsHeaders(request) });
      }

      // Secondary market mocks
      if (url.pathname === '/api/secondary-market/orderbook') {
        const mid = 50_000_000; // 50M ریال به عنوان میانگین قیمت هر توکن
        const spread = 500_000; // 0.5M ریال اسپرد کل
        const levels = 15;
        const bids = Array.from({ length: levels }).map((_, i) => ({
          price: mid - (i * 100_000),
          amount: Math.floor(5 + Math.random() * 50),
        }));
        const asks = Array.from({ length: levels }).map((_, i) => ({
          price: mid + (i * 100_000) + spread,
          amount: Math.floor(5 + Math.random() * 50),
        }));
        return new Response(JSON.stringify({ bids, asks, mid }), { status: 200, headers: corsHeaders(request) });
      }
      if (url.pathname === '/api/secondary-market/trades') {
        const now = Date.now();
        const trades = Array.from({ length: 30 }).map((_, i) => ({
          id: `tr-${i}`,
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          price: 49_500_000 + Math.floor(Math.random() * 1_500_000),
          amount: Math.floor(1 + Math.random() * 20),
          ts: new Date(now - i * 20_000).toISOString(),
        }));
        return new Response(JSON.stringify({ data: trades }), { status: 200, headers: corsHeaders(request) });
      }
      if (url.pathname === '/api/secondary-market/ticker') {
        const ticker = {
          last: 50_200_000,
          change24h: 2.3,
          high24h: 51_000_000,
          low24h: 48_700_000,
          volume24h: 12500,
        };
        return new Response(JSON.stringify(ticker), { status: 200, headers: corsHeaders(request) });
      }

      // Fallback mock: empty list
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: corsHeaders(request) });
    }

    try {
      const targetUrl = new URL(apiOrigin);
      targetUrl.pathname = url.pathname.replace(/^\/api/, '');
      targetUrl.search = url.search;

      const headers = new Headers(request.headers);
      headers.set('host', targetUrl.host);

      const proxied = await fetch(targetUrl.toString(), {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.clone().arrayBuffer(),
      });

      // CORS handling
      const responseHeaders = new Headers(proxied.headers);
      const origin = request.headers.get('Origin') || '*';
      responseHeaders.set('Access-Control-Allow-Origin', origin);
      responseHeaders.set('Vary', 'Origin');
      responseHeaders.set('Access-Control-Allow-Credentials', 'true');
      responseHeaders.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: responseHeaders });
      }

      // If proxy returns non-OK, fall back to mocks
      if (!proxied.ok) {
        return serveMock(url.pathname, request);
      }

      return new Response(proxied.body, { status: proxied.status, headers: responseHeaders });
    } catch {
      // Network or other failure → fall back to mocks
      return serveMock(url.pathname, request);
    }
  }

  // For non-API requests, continue to static asset/SPA routing
  return next();
};

export interface Env {
  API_ORIGIN: string;
}

function corsHeaders(request: Request): Headers {
  const headers = new Headers();
  const origin = request.headers.get('Origin') || '*';
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Vary', 'Origin');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return headers;
}

function serveMock(pathname: string, request: Request): Response {
  // Properties
  if (pathname === '/api/properties') {
    const body = JSON.stringify({ data: propertyJson.items || [] });
    return new Response(body, { status: 200, headers: corsHeaders(request) });
  }
  // Investments
  if (pathname === '/api/investments') {
    const body = JSON.stringify({ data: investmentJson.items || [] });
    return new Response(body, { status: 200, headers: corsHeaders(request) });
  }
  // Profile
  if (pathname === '/api/user-management/profile') {
    const body = JSON.stringify(userJson.me || null);
    return new Response(body, { status: 200, headers: corsHeaders(request) });
  }
  // Notifications
  if (pathname === '/api/notifications') {
    const now = new Date();
    const sample = [
      { _id: 'n1', title: 'خرید موفق', message: '۱۰ توکن آپارتمان ولیعصر خریداری شد', created_date: now.toISOString(), read: false },
      { _id: 'n2', title: 'پرداخت تایید شد', message: 'مبلغ ۵۰۰,۰۰۰,۰۰۰ ریال تایید شد', created_date: new Date(now.getTime()-3600_000).toISOString(), read: true },
    ];
    return new Response(JSON.stringify({ data: sample }), { status: 200, headers: corsHeaders(request) });
  }
  // Analytics dashboard
  if (pathname === '/api/analytics/dashboard') {
    const payload = {
      total_investment: 10000000000,
      total_current_value: 12000000000,
      total_profit_loss: 2000000000,
      weekly_change_percent: 3.2,
      monthly_change_percent: 12.5,
    };
    return new Response(JSON.stringify(payload), { status: 200, headers: corsHeaders(request) });
  }
  // Wallets
  if (pathname === '/api/wallets') {
    const wallets = [
      { id: 'wal-irt', currency: 'IRR', balance: 1500000000, available: 1200000000, locked: 300000000 },
    ];
    return new Response(JSON.stringify({ data: wallets }), { status: 200, headers: corsHeaders(request) });
  }
  // TREFs
  if (pathname === '/api/trefs') {
    const trefs = [
      { id: 'tref-1', title: 'صندوق ملکی مسکونی تهران', expected_annual_return: 18.2, aum: 50000000000, status: 'باز' },
      { id: 'tref-2', title: 'صندوق تجاری کلانشهر', expected_annual_return: 20.1, aum: 82000000000, status: 'باز' },
    ];
    return new Response(JSON.stringify({ data: trefs }), { status: 200, headers: corsHeaders(request) });
  }
  // Secondary market mocks
  if (pathname === '/api/secondary-market/orderbook') {
    const mid = 50_000_000;
    const spread = 500_000;
    const levels = 15;
    const bids = Array.from({ length: levels }).map((_, i) => ({
      price: mid - (i * 100_000),
      amount: Math.floor(5 + Math.random() * 50),
    }));
    const asks = Array.from({ length: levels }).map((_, i) => ({
      price: mid + (i * 100_000) + spread,
      amount: Math.floor(5 + Math.random() * 50),
    }));
    return new Response(JSON.stringify({ bids, asks, mid }), { status: 200, headers: corsHeaders(request) });
  }
  if (pathname === '/api/secondary-market/trades') {
    const now = Date.now();
    const trades = Array.from({ length: 30 }).map((_, i) => ({
      id: `tr-${i}`,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      price: 49_500_000 + Math.floor(Math.random() * 1_500_000),
      amount: Math.floor(1 + Math.random() * 20),
      ts: new Date(now - i * 20_000).toISOString(),
    }));
    return new Response(JSON.stringify({ data: trades }), { status: 200, headers: corsHeaders(request) });
  }
  if (pathname === '/api/secondary-market/ticker') {
    const ticker = {
      last: 50_200_000,
      change24h: 2.3,
      high24h: 51_000_000,
      low24h: 48_700_000,
      volume24h: 12500,
    };
    return new Response(JSON.stringify(ticker), { status: 200, headers: corsHeaders(request) });
  }
  // Default empty
  return new Response(JSON.stringify({ data: [] }), { status: 200, headers: corsHeaders(request) });
}

