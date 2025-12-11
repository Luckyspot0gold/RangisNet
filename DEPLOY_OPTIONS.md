# RangisNet - Cloudflare Pages Deployment

## Quick Deploy

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy landing page
wrangler pages deploy . --project-name=rangisnet-landing

# Deploy full Next.js app (after build completes)
cd Web
npm run build
wrangler pages deploy .next --project-name=rangisnet
```

## Your URLs will be:
- Landing: https://rangisnet-landing.pages.dev
- Full App: https://rangisnet.pages.dev

## Cloudflare Pages Config

Create `Web/wrangler.toml`:

```toml
name = "rangisnet"
compatibility_date = "2024-01-01"

[site]
bucket = ".next"

[build]
command = "npm run build"

[env.production]
name = "rangisnet"
route = "rangis.net/*"
```

## Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy landing page
netlify deploy --prod --dir=. --site=rangisnet-landing

# Deploy full app
cd Web
netlify deploy --prod --dir=.next --site=rangisnet
```

## Alternative: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd Web
railway init

# Deploy
railway up
```

Railway will automatically:
- Detect Next.js
- Run npm install
- Run npm build
- Start with npm start
- Give you a URL: https://rangisnet.up.railway.app
