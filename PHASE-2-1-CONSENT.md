# Phase 2.1 — Consent Management

Second milestone of the "Additional Scope" build. Builds directly on
[PHASE-2-0-FOUNDATION.md](PHASE-2-0-FOUNDATION.md)'s `Customer` and `Interaction`
models — no new foundational pieces needed, just a new domain model and a UI wired to
real persistence for the first time.

---

## Why this phase exists

Two independent reasons converge on the same feature:

1. **It's a hard prerequisite, not just good practice.** Phase 5 (Automated
   Communication) and Phase 6 (WhatsApp) can't send anything without checking consent
   first — and for WhatsApp specifically, Meta's Business Platform enforces this at
   the platform level: a business can't message a customer outside a user-initiated
   24-hour session window without documented opt-in. Building consent now, before any
   channel exists to send through, means Phase 5/6 have something real to check
   against from day one instead of retrofitting a gate onto already-shipped senders.
2. **The current "notifications" toggle is fake.** `app/dashboard/settings/page.tsx`
   had four `useState`-backed checkboxes (`order-updates`, `appointment-reminders`,
   `product-recommendations`, `community-replies`) that never persisted anywhere —
   reload the page and every toggle silently resets. A settings page that doesn't
   save what you tell it is worse than not having the setting at all.

## What was built

**`Consent`** — one row per `(customer, channel, purpose)` combination:

```prisma
model Consent {
  customerId String
  channel    ConsentChannel   // EMAIL | SMS | WHATSAPP
  purpose    ConsentPurpose   // MARKETING | TRANSACTIONAL | SUPPORT
  granted    Boolean
  source     String           // e.g. "dashboard-settings"
  updatedAt  DateTime
  @@unique([customerId, channel, purpose])
}
```

This replaced the old 4-category checkbox list with a 3×3 grid (channel × purpose) in
the settings page, because the old categories didn't map to anything Phase 5/6 can
actually act on — "order updates" doesn't say *which channel* to send it on, and
WhatsApp needs its own opt-in separate from email regardless of category.

## How it works

### Consent is never assumed — only an explicit write grants it

The API's `GET /api/consent?email=...` returns only the rows that exist; it never
fabricates a default. The `useConsent()` hook (`features/consent/hooks.ts`) treats a
missing row as `granted: false`. This was a deliberate choice over the alternative
(e.g., defaulting `TRANSACTIONAL` to `true` since order confirmations feel
"obviously fine to send") — WhatsApp's opt-in requirement doesn't carve out an
exception for transactional messages sent outside a session window, and building one
consistent rule ("no row = no send") is easier to reason about and audit than a rule
with silent exceptions baked in.

### The grid, not a list

`features/consent/constants.ts` defines 3 channels × 3 purposes. The settings page
renders this as a table: rows are purposes (with the plain-language description a
customer actually reads), columns are channels. Toggling a cell calls
`POST /api/consent` with `{ email, channel, purpose, granted, source }`, which
`prisma.consent.upsert()`s against the `@@unique([customerId, channel, purpose])`
constraint — flipping an existing cell updates that one row rather than creating a
duplicate (verified: granting then revoking the same cell twice left exactly one
`Consent` document, with `updatedAt` advancing each time).

### Every change lands on the CRM timeline for free

`POST /api/consent` calls `recordInteraction(customerId, "CONSENT_CHANGED", ...)` —
the same function every other phase will use. This was the exact payoff described in
Phase 0: no new audit-log code needed here, and Phase 4's CRM will show a real,
already-populated history of consent changes (verified directly against the live
database — see "Verification" below) without Phase 4 having shipped yet.

### Optimistic UI with rollback

`useConsent()`'s `toggle()` flips the checkbox immediately (optimistic update) and
only reverts it if the `POST` fails, with a toast explaining why. This matters
because consent changes should feel instant — a settings toggle that visibly lags
behind a network round-trip reads as broken, even when it isn't.

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Added `Consent`, `ConsentChannel`, `ConsentPurpose` |
| `app/api/consent/route.ts` | New — `GET` (list) / `POST` (upsert + log interaction) |
| `features/consent/types.ts` | New — `ConsentChannel`, `ConsentPurpose`, `ConsentRecord` |
| `features/consent/constants.ts` | New — the 3 channels × 3 purposes shown in the grid |
| `features/consent/services/consent-service.ts` | New — thin wrapper over `apiClient()` |
| `features/consent/hooks.ts` | New — `useConsent()`: loads the grid, optimistic `toggle()` |
| `app/dashboard/settings/page.tsx` | Replaced the fake 4-checkbox list with the real consent grid |

## Verification

Since this environment's Browser pane wasn't actively displayed, Framer Motion's
route-transition animation (`components/motion/page-transition.tsx`, `initial`
→ `animate` opacity fade) never advanced past its first frame — a `requestAnimationFrame`-driven
animation stalls when a tab isn't actually being composited, which is a property of
this test environment, not the app (reproduced identically on the untouched
`/dashboard` route). Rather than claim a visual check I couldn't actually see, Phase
1 was verified the same way Phase 0 was: directly against the running server and the
live database.

```
GET  /api/consent?email=phase1test@petzu.world        → { data: [] }
POST channel=WHATSAPP purpose=TRANSACTIONAL granted=true
POST channel=EMAIL    purpose=MARKETING     granted=true
GET  /api/consent?email=phase1test@petzu.world        → both rows present
POST channel=WHATSAPP purpose=TRANSACTIONAL granted=false
GET  /api/consent?email=phase1test@petzu.world        → WhatsApp row now granted:false,
                                                          same row id (no duplicate),
                                                          Email/Marketing untouched
```

Directly queried `Interaction` afterward and confirmed all three `CONSENT_CHANGED`
rows with correct `metadata`. Test customer, consents, and interactions were deleted
afterward — this was verification data, not real customer data. `npm run verify`
(typecheck + lint + 67 tests + build) is green.

**Still worth doing when the Browser pane is actively visible:** a manual pass over
the settings page grid to confirm the checkboxes render and toggle visually as
expected — the API-level proof confirms the logic is correct, not that the table
markup renders cleanly at every breakpoint.

## What's next

**Phase 2 — Knowledge-base Structure**: MongoDB-backed Q&A articles that Phase 3's
chatbot will ground its answers in, seeded from the existing static FAQ content in
`features/blog/constants.ts`.
