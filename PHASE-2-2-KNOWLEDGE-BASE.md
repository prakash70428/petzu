# Phase 2.2 — Knowledge-base Structure

Third milestone of the "Additional Scope" build. This one exists almost entirely to
serve **Phase 3 (AI Chatbot)** — an LLM answering PetZu-specific questions without
grounding will confidently make up prices, policies, and turnaround times. This phase
gives it something real to check against first.

---

## Why this phase exists

The `/faq` page (`app/faq/page.tsx`) already has real content — 11 Q&A pairs across 4
categories, hardcoded in `features/blog/constants.ts`. Two problems with using that
directly as the chatbot's source of truth:

1. **It's static, compiled into the app bundle.** Updating an answer means a code
   change, a PR, a deploy — fine for public marketing copy that rarely changes, wrong
   for the kind of content staff should be able to fix the moment they notice it's
   stale (a changed return-window policy, a new city added to delivery coverage).
2. **It's not staff-editable at runtime.** Phase 3's chatbot and Phase 7's feedback
   triage both need a *maintained* knowledge source, not a frozen one.

## Why seed from `/faq` instead of migrating it

The obvious-looking alternative — replace `features/blog/constants.ts`'s
`faqCategories` with a fetch from the new `KnowledgeArticle` collection — was
deliberately not done. The public `/faq` page is marketing copy: it should render
fast, work with zero database round-trip, and stay under the same review process as
the rest of the site's static content. The knowledge base is an internal,
staff-editable working set that happens to start from the same 11 answers. Seeding
(copying, once) keeps those two concerns separate — editing a KB article for the
chatbot's benefit doesn't silently change what a visitor reads on `/faq`, and vice
versa. If the two ever need to converge later, that's a deliberate decision to make
then, not a side effect of this phase.

## Why keyword search, not vector search

At 11 articles today (and realistically dozens, not thousands, for a single-business
FAQ), embedding-based retrieval is solving a problem this dataset doesn't have.
`lib/ai/knowledge-retrieval.ts` does a full collection scan, tokenizes the query, and
scores each article by term overlap — weighting a match in the *question* higher than
one buried in the *answer* (searching "return policy" should rank the "What's your
return policy?" article above one that merely mentions returns in passing). Verified
directly: querying `?q=return policy` against the 11 seeded articles returns exactly
that one article, ranked first. If the KB grows to a size where this stops scoring
well, MongoDB Atlas Search (available even on the free tier) is the natural upgrade —
but standing that up now, for 11 rows, would be solving next year's problem today.

## Staff access — `lib/auth/is-staff.ts`

Writing to the knowledge base needed *some* access control — a public POST endpoint
that anyone could hit would let anyone rewrite the chatbot's source of truth. There's
no `role` field anywhere in this app (per `AUTH.md`), so this reuses the exact
pattern Phase 0 already established for identity: `ADMIN_EMAILS` is a comma-separated
env var, and `isStaff(email)` checks a client-supplied email against it. This carries
the same limitation already documented for the identity bridge — the email is
unverified — and gets fixed identically the day real sessions exist. What matters
today: **every mutation route re-checks `isStaff()` server-side**, so the
`/dashboard/admin/knowledge` page hiding its form from non-staff is a UX nicety, not
the actual boundary — confirmed directly (see Verification).

`GET /api/staff?email=...` exists so the client can decide what to render without
ever seeing `ADMIN_EMAILS` itself. It's not a security boundary either — it's there
so Phase 4's CRM pages can reuse the exact same check without duplicating this
endpoint.

## What was built

```prisma
model KnowledgeArticle {
  category  String
  question  String
  answer    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- `GET /api/knowledge` — public read; `?q=` triggers the keyword search, omitting it
  returns everything.
- `POST /api/knowledge` / `PATCH /api/knowledge/[id]` / `DELETE /api/knowledge/[id]`
  — staff-only writes.
- `GET /api/staff?email=` — UX-only staff check, reusable by later phases.
- `prisma/seed.ts` — copies `features/blog/constants.ts`'s `faqCategories` into
  `KnowledgeArticle` rows. Idempotent: re-running skips any `(category, question)`
  pair that already exists rather than duplicating it (verified — a second run
  reported `0 created, 11 already present`).
- `app/dashboard/admin/knowledge/page.tsx` — staff-gated CRUD UI: add/edit/delete
  articles. **Not linked from the shared customer sidebar nav**
  (`features/dashboard/constants.ts`'s `dashboardNav`) on purpose — that nav renders
  for every logged-in customer, and this page isn't for them. Phase 4 (CRM) will
  introduce a real staff-only shell; until then, staff reach this page by URL.

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Added `KnowledgeArticle` |
| `lib/auth/is-staff.ts` | New — `ADMIN_EMAILS` allowlist check |
| `lib/ai/knowledge-retrieval.ts` | New — `searchKnowledge()`, the function Phase 3's chatbot will call |
| `app/api/knowledge/route.ts` | New — `GET` (list/search) / `POST` (staff-only create) |
| `app/api/knowledge/[id]/route.ts` | New — `PATCH` / `DELETE` (staff-only) |
| `app/api/staff/route.ts` | New — `GET`, UX-only staff check |
| `prisma/seed.ts` | New — seeds from `features/blog/constants.ts` |
| `features/knowledge-base/` | New — `types.ts`, `services/knowledge-service.ts`, `hooks.ts` |
| `app/dashboard/admin/knowledge/page.tsx` | New — staff CRUD UI |
| `package.json` | Added `tsx` (devDep), `db:seed` script, `prisma.seed` config |
| `.env.example` | Documented `ADMIN_EMAILS`, moved earlier now that Phase 2 needs it |

## Verification

Ran directly against the live server and database (same approach as Phase 1 — this
environment's Browser pane doesn't composite frames, so Framer Motion's route
transition never resolves; see PHASE-2-1-CONSENT.md for the full explanation):

```
npm run db:seed            → 11 created, 0 already present
npm run db:seed (again)    → 0 created, 11 already present   (idempotency confirmed)

GET  /api/knowledge                       → all 11 articles
GET  /api/knowledge?q=return policy       → exactly the "What's your return policy?"
                                             article, ranked first
GET  /api/staff?email=<non-staff>         → { isStaff: false }
GET  /api/staff?email=<ADMIN_EMAILS entry>→ { isStaff: true }
POST /api/knowledge  (non-staff email)    → 403 "Not authorized"
POST /api/knowledge  (staff email)        → 201, article created
PATCH .../[id]        (staff email)       → answer updated, updatedAt advanced
DELETE .../[id]       (staff email)       → removed
GET  /api/knowledge                       → back to 11 (clean)
```

`npm run verify` (typecheck + lint + 67 tests + build) is green.
`ADMIN_EMAILS` was set to the project owner's own email in the local `.env` (not
committed) so `/dashboard/admin/knowledge` is usable directly, not just via curl.

**Still worth doing when the Browser pane is actively visible:** confirm the admin
page's form and article list render and behave correctly — same caveat as Phase 1.

## What's next

**Phase 3 — AI Chatbot (Claude API)**: a streaming chat widget backed by
`@anthropic-ai/sdk`, with `searchKnowledge()` from this phase feeding relevant
articles into the system prompt so answers are grounded in what staff have actually
written, not the model's guess.
