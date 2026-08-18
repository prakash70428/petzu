# Deploying The PetZu World

The app is a standard Next.js 16 SSR app with **no backend, no database, and no environment
variables** — every "backend" in this project (cart, wishlist, auth session, dashboard data) is
localStorage-backed by design (see ARCHITECTURE.md / AUTH.md). That makes hosting close to
zero-config.

## Recommended: Vercel

Vercel is the natural fit here — it's built by the Next.js team, auto-detects the framework, and
its free tier comfortably covers a project this size (no serverless function usage beyond what
Next's own SSR needs, no cron jobs, no external API calls).

### 1. Push to GitHub

```bash
git remote -v          # confirm there isn't already a remote
git push -u origin main
```

If there's no remote yet, create an empty GitHub repo first, then:

```bash
git remote add origin https://github.com/<you>/thepetzu-world.git
git push -u origin main
```

### 2. Import into Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → select the repo.
2. Framework preset: **Next.js** (auto-detected, no changes needed).
3. Build command / output: leave as default (`next build`, `.next`).
4. **Environment variables: none required.** Leave that section empty.
5. Click **Deploy**.

That's it — Vercel builds and serves it. No `vercel.json` needed: the security headers this app
sets (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are
already defined in `next.config.ts`'s `headers()` function, which Vercel respects natively.

### 3. Connect the custom domain

`constants/site.ts` has `siteConfig.url` set to `https://thepetzu.world` — if you own that domain
(or whichever one you're actually using):

1. Vercel project → **Settings → Domains** → add the domain.
2. Point its DNS at Vercel (an `A`/`CNAME` record, or transfer nameservers — Vercel's domain
   screen gives you the exact records to add wherever the domain is registered).
3. Once DNS propagates, Vercel issues an SSL certificate automatically.

If the real domain differs from `thepetzu.world`, update `siteConfig.url` in
[constants/site.ts](constants/site.ts) before deploying — it feeds the canonical URLs in
`app/sitemap.ts`, `app/robots.ts`, and every page's Open Graph metadata.

### 4. Every future push auto-deploys

Once connected, Vercel builds a preview deployment for every branch/PR and promotes `main` to
production automatically on merge — no CI config to write.

## Before the first deploy

Run the full verification script locally once, so nothing surprises the Vercel build:

```bash
npm run verify
```

This runs typecheck → lint → tests → build in sequence (see `package.json`). If it's clean
locally, it'll be clean on Vercel.

## Alternatives (if not Vercel)

Any platform that runs a standard Node.js Next.js SSR server works the same way — Netlify,
Railway, Render, or a plain VPS with `npm run build && npm run start`. The only Vercel-specific
convenience is zero-config header/redirect handling; everywhere else, `next.config.ts` already
carries that configuration itself, so nothing extra is required there either.
