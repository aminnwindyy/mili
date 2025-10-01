# Cloudflare Pages Deployment (mili-mekl)

## Prerequisites
- Node.js 18+
- Cloudflare account with Pages enabled
- Wrangler CLI: `npm i -g wrangler` (or use `npx wrangler`)

## Configure
1. Set your API origin in `wrangler.toml` if you need to proxy `/api/*`:

```
[vars]
API_ORIGIN = "https://your-api.example.com"
```

2. SPA routing and API proxy are configured:
- `public/_redirects` contains SPA fallback.
- `functions/[[path]].ts` proxies `/api/*` to `API_ORIGIN` with CORS.

## Develop locally
```bash
npm install
npm run cf:build
npm run cf:dev
```
By default, the dev server serves the built `dist` with Pages Functions active.

## Build
```bash
npm run cf:build
```
This uses Vite to generate `dist/` which Pages will serve.

## Deploy
```bash
# First time: authenticate
wrangler login

# Deploy to Cloudflare Pages
npm run cf:deploy
```

## Notes
- The Vite dev proxy in `vite.config.ts` is only for local `vite` dev. On Pages, `/api/*` is handled by the Pages Function.
- Adjust CORS behavior in `functions/[[path]].ts` if needed.

