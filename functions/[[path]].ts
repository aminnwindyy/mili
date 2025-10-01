// Lightweight mock data for demo when API_ORIGIN is not configured
// We import JSON so Wrangler bundles it with the function.
// Only keys the frontend actually needs are exposed.
// If you add new areas, extend the mocks map below.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import propertyJson from '../Entites/Property.json';

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

      // Fallback mock: empty list
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: corsHeaders(request) });
    }

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

    return new Response(proxied.body, { status: proxied.status, headers: responseHeaders });
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

