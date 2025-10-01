export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Proxy API requests to external origin if configured
  if (url.pathname.startsWith('/api/')) {
    const apiOrigin = env.API_ORIGIN?.toString().trim();
    if (!apiOrigin) {
      return new Response('API_ORIGIN not configured', { status: 500 });
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

