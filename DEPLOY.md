# Deploying The PetZu World

A Next.js 16 (App Router) app on **Vercel**, with a **MongoDB Atlas** database
reached through **Prisma**. The public marketing/shop pages are statically
prerendered; the database backs the API routes under `app/api/**` (chatbot,
CRM, feedback, knowledge base, consent, customer records).

> **Cart, wishlist and the signed-in session are still browser `localStorage`**
> by design — there is no real authentication yet, so there is nothing to key
> server-side data to. See `AUTH.md` §8 for what changes when real sessions
> land. Everything else persists to MongoDB.

## Hosting: Vercel

Vercel auto-detects Next.js. The `vercel-build` script (`prisma generate &&
next build`) regenerates the Prisma client on every deploy, so a schema
change ships just by pushing to `main`.

### 1. Push to GitHub

```bash
git push -u origin main
```

### 2. Import into Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → select the repo.
2. Framework preset: **Next.js** (auto-detected).
3. Add the environment variables below.
4. **Deploy.** Every push to `main` redeploys production automatically.

### 3. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (all
environments). Full annotated list in [.env.example](.env.example).

| Variable | Required | What it does |
|---|---|---|
| `DATABASE_URL` | **Yes** | MongoDB Atlas SRV connection string, including the database name (`…mongodb.net/petzu?retryWrites=true&w=majority`). Without it every `app/api/**` route 500s. |
| `ADMIN_EMAILS` | For the admin area | Comma-separated allowlist of emails that may open `/dashboard/admin/**` and write through staff routes. See `lib/auth/is-staff.ts`. |
| `ANTHROPIC_API_KEY` | For live chatbot replies | Without it the chat widget still works end to end but replies "not configured". |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | For real emails | Without it, sends log to `MessageLog` as `QUEUED` instead of going out. |
| `MSG91_AUTH_KEY` / `MSG91_SENDER_ID` | For SMS | India SMS needs a DLT-registered template — illustrative until then. |
| `WHATSAPP_*` | For WhatsApp Business | See `PHASE-2-6-WHATSAPP.md`. |

Every integration degrades gracefully when its key is absent — only
`DATABASE_URL` is load-bearing.

## Database: MongoDB Atlas

One-time setup (and how to give the client access) is in
**[DATABASE.md](DATABASE.md)**. In short:

```bash
# after DATABASE_URL is set locally in .env
npx prisma db push   # sync prisma/schema.prisma → Atlas collections + indexes
npm run db:seed      # load the knowledge base from the static FAQ content
```

`prisma db push` (not `migrate`) is correct here: MongoDB has no migration
history — the schema file is pushed straight to the database.

## The custom domain

`constants/site.ts` → `siteConfig.url` is `https://thepetzu.com`.

- Vercel → **Settings → Domains** → `thepetzu.com` + `www.thepetzu.com` (www 307-redirects to the apex).
- DNS at GoDaddy: `A @ → 216.198.79.1`, `CNAME www → <project>.vercel-dns.com`. Email records (MX/SPF/DKIM/DMARC) are untouched.
- SSL is issued automatically once DNS resolves.

## Before a release

```bash
npm run verify   # typecheck → lint → test → build, in sequence
```

If that's clean locally it'll be clean on Vercel.
