# Phase 2.8 — Data Portability

Ninth and final milestone of the "Additional Scope" build. Every prior phase added a
new collection that holds something a customer provided or generated — this phase's
whole job is making sure they can get it all back out, and that "delete my account"
stops being the one button in this app that lied about what it did.

---

## Why this phase exists

Two things, both real:

1. **Portability is a right, not a nicety** — GDPR Art. 20 and India's DPDP Act both
   require letting a person export their own data in a structured, usable format.
   Seven phases of building real persistence means this app now actually holds data
   worth exporting — consent choices, chat transcripts, feedback, a record of every
   message sent.
2. **The existing "Delete account" button was fake.** `app/dashboard/settings/page.tsx`'s
   `handleDeleteAccount` called `logout()` — clearing `localStorage` — and nothing
   else, while its own dialog said "This permanently removes your account." That gap
   was flagged explicitly during planning, and you confirmed fixing it
   ("Haan, real banao") before this phase started.

## What was built

- `GET /api/customers/export?email=` — a structured JSON download of everything the
  customer provided or generated: profile, consent history, the full `Interaction`
  timeline, chat conversations with messages, a record of messages sent to them, and
  their feedback/complaint submissions.
- `DELETE /api/customers?email=` — permanently deletes the `Customer` row and every
  record that references it, added to the existing `app/api/customers/route.ts`
  alongside its `POST`.
- Settings page: a new "Your data" card with a real **Export my data** button, and
  the **Delete account** flow now actually deletes, with dialog/alert copy that says
  only what's true.

## How it works

### What's in the export, and what's deliberately left out

`Note` (staff-authored CRM context) and `Tag`/`CustomerTag` (staff categorization)
are excluded — verified directly (see below), a full test export correctly contained
consent/timeline/chat/messages/feedback but no trace of a note or tag seeded
alongside them. This mirrors the distinction Phase 4 already drew: what staff wrote
*about* a customer isn't the customer's own data to receive back. `MessageLog`
entries include only what was actually sent to them (channel, purpose, template,
status, timestamps) — `providerId` and internal `error` diagnostics are excluded as
this app's own operational data, not theirs.

### Deletion is one call because eight schema decisions already made it one call

`prisma.customer.delete()` cascades through every one of the eight relations built
across Phases 0–7 (`Interaction`, `Consent`, `ChatConversation` → `ChatMessage`,
`Note`, `CustomerTag`, `MessageLog`, `Feedback`) — because every single one was
written with `onDelete: Cascade` from the moment it was created, not retrofitted now.
This is the same payoff shape as `Interaction` itself: a decision made once, early,
that made a later phase almost trivial to build correctly.

**This was verified as rigorously as anything in this build** — proportional to it
being the one operation in this app that's irreversible by design. A test customer
was seeded with one row in *every* related collection (including a `ChatMessage`,
which requires cascading two levels deep through its parent `ChatConversation`, and
a shared `Tag` via `CustomerTag`), then deleted. A direct query against every single
collection afterward — `Customer`, `Consent`, `Interaction`, `ChatConversation`,
`ChatMessage`, `MessageLog`, `Feedback`, `Note`, `CustomerTag` — came back empty
across the board. Nothing orphaned.

### The settings page copy now says only what's real

The old dialog said deletion "clears your demo session and all locally stored data."
The new copy says what actually happens: "This permanently deletes your account and
everything linked to it." The Danger Zone alert lists what's real (profile, consent
settings, chat history, message history, feedback) — not "saved pets, and order
history," which was never true, since pets/orders remain client-only mock data this
build never migrated to the database (that was always out of scope; see
`ARCHITECTURE.md`/`DEPLOY.md`'s original frontend-only framing).

## What changed

| File | Change |
|---|---|
| `app/api/customers/export/route.ts` | New — `GET`, raw JSON file download |
| `app/api/customers/route.ts` | Added `DELETE` |
| `features/account/services/account-service.ts` | New — `exportMyData()` (triggers a real browser download), `deleteMyAccount()` |
| `features/account/hooks.ts` | New — `useAccountActions()` |
| `app/dashboard/settings/page.tsx` | Added "Your data" export card; `handleDeleteAccount` now calls the real delete endpoint; dialog/alert copy corrected |

## Verification

Full rigor, both levels — this operation is irreversible, so it got tested more
thoroughly than any prior phase's feature:

**Backend, via curl + direct database queries:**
```
Seeded one row in EVERY related collection for a test customer
  (Consent, Interaction, ChatConversation+ChatMessage, MessageLog, Feedback,
   Note, CustomerTag)

GET /api/customers/export?email=...
  → correct Content-Disposition header, dated filename
  → all 5 expected sections present with correct data
  → Note and CustomerTag correctly absent
  → MessageLog entries correctly omit providerId/error

DELETE /api/customers?email=...
  → { deleted: true }

Direct query against all 9 collections afterward:
  → Customer: null. Every other collection: 0 rows. Including ChatMessage,
    which only exists through a two-level cascade (Customer → ChatConversation
    → ChatMessage) — confirming the cascade chain, not just the direct relations.
```

**UI, via real browser (Claude in Chrome), for a real signed-in test account:**
```
Settings page → "Export my data" → GET request confirmed in the dev server's
  own request log (200 OK) — first coordinate-based click attempt missed the
  button entirely (same stale-coordinate lesson as Phase 7); a find()-located
  ref click worked correctly.

Settings page → "Delete account" → confirmation dialog with the corrected
  copy → "Yes, delete it" → toast "Account deleted — Your PetZu account and
  its data have been removed" → session cleared, redirected away from the
  dashboard (the existing auth guard's own redirect fired essentially
  simultaneously with this phase's explicit one, landing on /sign-in rather
  than / — a benign, reasonable place to land after deleting your own
  account, not a bug).

Confirmed directly afterward: prisma.customer.findUnique for that exact
  email returned null — the account deleted through the real UI flow, not
  just the API, was genuinely gone.
```

`npm run verify` (typecheck + lint + 67 tests + build) is green. Test data across all
collections was cleaned up after each check.

## What's next

This closes the "Additional Scope" roadmap — all 9 phases (0 through 8) planned and
approved are now built: backend foundation, consent management, knowledge base, AI
chatbot, in-house CRM, automated communication, WhatsApp two-way, feedback tracking,
and data portability. What remains is entirely external and outside what code can
finish: a real `ANTHROPIC_API_KEY` for live chatbot answers, Resend/MSG91/Meta
credentials for real sends, and Meta Business verification for WhatsApp — all
documented per-phase in each `PHASE-2-*.md` file and in `.env.example`.
