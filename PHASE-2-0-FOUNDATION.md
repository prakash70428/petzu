# Phase 2.0 — Backend Foundation

This is the first milestone of the "Additional Scope" build (the ₹65,000 line item
in the commercial proposal: WhatsApp Business Integration, Chatbot, CRM Integration,
Automated Communication, Feedback & Complaint Tracking, Consent Management,
Knowledge-base Structure, Data Portability). Every one of those 8 features needs a
database and a stable customer identity — neither existed before this milestone — so
this phase builds only that shared foundation, nothing feature-specific yet.

---

## Why this phase exists

`AUTH.md` and `DEPLOY.md` state plainly that this app has **no backend, no database,
no environment variables** — "login" writes to `localStorage` and accepts any
credentials; dashboard pets/orders/appointments are hardcoded mock arrays with no
link to the logged-in user at all. That's a deliberate, honest design for a
frontend-only milestone, but it means none of the 8 additional-scope items can be
built as *real* features on top of it — a WhatsApp message, a consent record, a
CRM note all need somewhere durable to live, and something to attach them to.

Building that shared piece once, generically, up front avoids the alternative: each
of the 8 features inventing its own ad-hoc persistence and its own idea of "who is
this customer," which would drift and duplicate by Phase 3.

## What was built

1. **MongoDB Atlas + Prisma**, wired and connected to a real free-tier cluster
   (`thepetzu-world` org → `thepetzu-world` project → `Cluster0`, AWS Mumbai).
   Originally scoped as Postgres+Prisma; switched to MongoDB when a MongoDB Atlas
   org was already set up — Prisma's MongoDB connector works the same way from the
   application code's point of view (same `PrismaClient`, same query API), the
   differences are schema-level: `ObjectId` primary keys instead of `cuid()` strings,
   and `prisma db push` instead of `prisma migrate dev` (Mongo has no migration
   history — see "Why `db push`, not `migrate`" below).
2. **`Customer`** — the one durable identity every later phase attaches data to.
3. **`Interaction`** — a single unified activity timeline. This is the one
   structural decision worth calling out: it would have been just as easy to give
   Phase 1 (Consent) and Phase 3 (Chatbot) their own private audit trails and invent
   a CRM timeline later in Phase 4 by querying across all of them. Instead,
   `Interaction` is modeled *now*, and every later phase writes into it via one
   helper. The payoff: Phase 4 (CRM) becomes "build a UI that reads a table that's
   already been filling up since Phase 1," not a retrofit that goes back into three
   already-shipped features to bolt on logging.
4. **`app/api/customers`** — the first real API route in the project, proving the
   pattern end to end (Zod-validated request → Prisma write → typed JSON response)
   that every later route follows.

## How it works

### The customer identity bridge

The current `User` type (`features/auth/types.ts`) has no `id` — just
`{ name, email, bio?, initials, memberSince }` — and there's no server-verified
session to read one from. Rebuilding real authentication (password hashing, server
sessions, `middleware.ts` route protection — all listed as *not yet built* in
`AUTH.md` §8–9) is explicitly out of scope for this build.

The bridge is deliberately minimal: `email` is the natural key.

```prisma
model Customer {
  id    String  @id @default(auto()) @map("_id") @db.ObjectId
  email String  @unique
  name  String?
  phone String?
}
```

Every API route that needs "the current customer" receives `email` explicitly from
the client (`useSession().user.email` in the request body — **not** a cookie) and
resolves it through one function:

```ts
// lib/customer.ts
export async function getOrCreateCustomer(email: string, name?: string) {
  return prisma.customer.upsert({
    where: { email },
    create: { email, name },
    update: name ? { name } : {},
  });
}
```

**Why not just set a session cookie and call it done?** Because that would *look*
more secure than it is. A cookie set from an unverified client email is still an
unverified identity wearing a costume. `AUTH.md` was written to be honest about
`localStorage` sessions being fake rather than dressing them up — this bridge keeps
that same honesty: passing `email` explicitly on every call makes it obvious, at
every call site, that nothing has verified who's asking.

**The risk, stated plainly:** anyone can call `/api/customers` (or any future route
built on this bridge) with any email string and read/write that "customer's" data —
consent settings, chat history, CRM notes, exported data. This is **not a new
weakness** — today's fake login already accepts any password for any email, so
nothing server-side trusted that identity before either. But it's a real limitation
worth fixing eventually, and now there's exactly one place to fix it: the day real
auth lands, every `getOrCreateCustomer(email)` call becomes
`getOrCreateCustomer(session.user.email)` reading from a verified server session,
and no other file changes.

### The activity timeline

```prisma
model Interaction {
  id         String          @id @default(auto()) @map("_id") @db.ObjectId
  customerId String          @db.ObjectId
  type       InteractionType  // CONSENT_CHANGED, CHAT_MESSAGE, EMAIL_SENT, ...
  summary    String
  metadata   Json?
  createdAt  DateTime        @default(now())
}
```

One function, `recordInteraction()` in `lib/crm/activity.ts`, appends a row. Phases
1, 3, 5, 6, and 7 will each call it once from their own write paths — a consent
toggle, a chat turn, a sent message, a filed complaint. `metadata` is deliberately
untyped `Json` because each interaction type carries a different shape and this
table is read-only display (a CRM timeline), never queried by its contents.

### The route convention

`app/api/customers/route.ts` establishes the shape every future route follows:

```
Zod schema validates the body
  → helper function does the Prisma write (getOrCreateCustomer, recordInteraction, ...)
  → lib/api-response.ts wraps the result: { data } on success, { error } on failure
```

`services/api-client.ts` (which already existed, unused, before this phase) throws
`ApiError` on any non-2xx response — so `{ error }` bodies pair directly with that
existing client-side error handling without needing to touch it.

### Why the build doesn't need a live database yet

`npm run build` (part of `npm run verify`) succeeded with **no `DATABASE_URL` set
anywhere in this environment**. That's not an accident — every Prisma call in this
phase lives inside a request handler (`app/api/customers/route.ts`'s `POST`), never
at module top-level or inside `generateStaticParams`. Next.js only needs a live
connection when a request actually comes in, which is why `/api/customers` shows up
in the build output as `ƒ` (server-rendered on demand) rather than being evaluated
at build time. This constraint has to hold for every route in every future phase —
it's the difference between "the build breaks the moment `DATABASE_URL` is unset"
and "the build always passes, and only requests to that one route fail until a real
database is connected."

### Why `db push`, not `migrate`

Postgres+Prisma projects normally use `prisma migrate dev` — it writes a numbered SQL
migration file per schema change, so the history of *how* the schema evolved is
version-controlled alongside the code. MongoDB has no equivalent concept (no `ALTER
TABLE`, no migration log) — Prisma's MongoDB connector instead offers `prisma db
push`, which diffs `schema.prisma` against the live database and directly
creates/updates collections, indexes, and validators to match. That's why
`package.json`'s script is `db:push`, not `db:migrate`, and why there's no
`prisma/migrations/` folder in this repo — for Mongo that folder simply doesn't
exist. The trade-off: no automatic rollback history, so schema changes that would
drop data (e.g. removing a required field) need to be reasoned about by hand before
running `db push` against a database with real rows in it.

**Confirmed working end to end** — `npm run db:push` created the `customers` and
`interactions` collections plus the `customers_email_key` unique index and the
`interactions_customerId_createdAt_idx` index on the live Atlas cluster, and a live
`POST /api/customers` request against a running `npm run dev` server wrote and read
back a real document (verified, then deleted as test data).

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | New — `Customer`, `Interaction`, `InteractionType` |
| `lib/prisma.ts` | New — singleton `PrismaClient` (dev hot-reload safe) |
| `lib/customer.ts` | New — `getOrCreateCustomer()`, the identity bridge |
| `lib/crm/activity.ts` | New — `recordInteraction()`, the shared timeline writer |
| `lib/api-response.ts` | New — `ok()` / `fail()` response envelope helpers |
| `app/api/customers/route.ts` | New — first real API route |
| `.env.example` | New — documents every env var this build will eventually need |
| `.env` | New, **not committed** (git-ignored via `.env*`) — real `DATABASE_URL` for the live Atlas cluster |
| `next.config.ts` | Added `serverExternalPackages: ["@prisma/client"]` |
| `package.json` | Added `@prisma/client`, `prisma`; `postinstall`, `db:push`, `vercel-build` scripts |

## Database setup (done)

A MongoDB Atlas free-tier (M0) cluster is live: org `thepetzuworld` → project
`thepetzu-world` → `Cluster0` (AWS, Mumbai `ap-south-1`), `$0/hour`. Atlas's
"Automate security setup" auto-created a database user and allow-listed this
machine's IP; the auto-generated password was replaced with one set directly (to
avoid any transcription error) via Database Access → Edit → Edit Password. The
connection string lives only in the local, git-ignored `.env` — never in this repo.
`npm run db:push` has already been run against it (see "Confirmed working end to
end" above), so `Customer`/`Interaction` collections exist and Phase 1 can start
writing to them immediately.

On Vercel: set `DATABASE_URL` in the project's environment variables (same value as
local `.env`, or a separate DB user for production — recommended once this goes
live), and set the **Build Command** to `npm run vercel-build`.

## What's next

**Phase 1 — Consent Management**: per-channel (Email/SMS/WhatsApp), per-purpose
(Marketing/Transactional/Support) consent records, replacing the currently-fake
`useState` preferences in `app/dashboard/settings/page.tsx`. This is a hard
prerequisite for Phase 5 (Automated Communication) and Phase 6 (WhatsApp) — Meta's
WhatsApp Business Platform will reject/restrict outbound messages without documented
opt-in, so this isn't just good practice, it's a platform requirement.
