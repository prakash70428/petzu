# Phase 2.4 — In-house CRM

Fifth milestone. As predicted in every prior phase's "what's next" section, this one
turned out to be mostly a UI layer — the data has been accumulating in `Interaction`
since Phase 1, so this phase's real job was building a staff view over it, plus the
two genuinely new pieces: notes and tags.

---

## Why this phase exists

Before this, a customer's information was scattered: consent state in one
collection, chat history in another, nothing showing them side by side. Staff had no
single place to look up "who is this customer and what's their history with us" — and
nowhere to record something a system can't capture on its own, like "called about a
delayed order, resolved with a partial refund."

## What was built

```prisma
model Note        { customerId, authorEmail, body, createdAt }
model Tag         { name }                                    // shared pool
model CustomerTag { customerId, tagId }                        // join, @@unique
```

A customer list (`/dashboard/admin/customers`, searchable by name/email) and a detail
page (`/dashboard/admin/customers/[id]`) showing profile, tags, granted consents,
staff notes, and — the centerpiece — a unified activity timeline.

## How it works

### The timeline is a read, not a write

`app/api/crm/customers/[id]/route.ts`'s `GET` handler is almost entirely `include`
clauses: tags, notes, consents, and up to 200 `Interaction` rows, ordered newest
first. There's no aggregation logic to write because Phase 0 already decided
`Interaction` would be the one place every phase logs to. Verified directly (see
below): a test customer's timeline showed a `CONSENT_CHANGED` row from a Phase-1-era
API call sitting right next to a `NOTE_ADDED` row created in this phase, correctly
ordered by time, with zero code written to merge them — they were already the same
table.

### Notes get logged twice, on purpose

Adding a note does two things: creates a `Note` row (the durable, full-detail copy
the CRM detail page reads its "Staff notes" section from) and calls
`recordInteraction()` with a truncated summary (type `NOTE_ADDED`). This isn't
duplication for its own sake — `Note` is the source of truth for note content,
`Interaction` is what makes a note show up inline in the same chronological feed as
everything else without the timeline query needing to know about five different
table shapes.

### Tags are a shared pool, not per-customer strings

`Tag.name` is globally unique; `CustomerTag` is the join. The alternative — a
`tags: string[]` field directly on `Customer` — was rejected because it can't support
"show me every VIP customer" without a full collection scan comparing array
contents, whereas a join table can be queried and (later, if this grows) indexed
properly. At today's scale this is a small difference; it's the kind of choice that's
free to make correctly now and expensive to fix after the tag list has real data in
it.

### The staff-only shell, finally

`app/dashboard/admin/layout.tsx` is new: a shared gate (`useStaffGate()`, promoted
this phase from knowledge-base-specific code to the top-level `hooks/`/`services/`
folders per this codebase's own rule — "code two or more features need belongs at
the top level") plus a small sub-nav linking Customers and Knowledge base. Phase 2's
admin page previously did its own staff-check-and-redirect; that logic now lives once,
here, and `app/dashboard/admin/knowledge/page.tsx` was simplified to assume the layout
already handled it — the exact "real staff-only shell" follow-up flagged as future
work in `PHASE-2-2-KNOWLEDGE-BASE.md`.

**Worth being explicit about:** this is still a UX gate, not the security boundary.
Every write in `app/api/crm/customers/**` re-checks `isStaff()` server-side
independently — confirmed directly (see Verification) — so the layout hiding the
nav from non-staff is about not showing broken-looking links, not about what's
actually enforced.

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Added `Note`, `Tag`, `CustomerTag` |
| `app/api/crm/customers/route.ts` | New — `GET` (staff-only list, `?q=` search) |
| `app/api/crm/customers/[id]/route.ts` | New — `GET` (full detail + timeline) |
| `app/api/crm/customers/[id]/notes/route.ts` | New — `POST` (add note, logs `NOTE_ADDED`) |
| `app/api/crm/customers/[id]/tags/route.ts` | New — `POST` / `DELETE` (attach/remove tag) |
| `features/crm/` | New — `types.ts`, `services/crm-service.ts`, `hooks.ts`, `components/customer-timeline.tsx` |
| `app/dashboard/admin/layout.tsx` | New — shared staff gate + sub-nav for the whole admin area |
| `app/dashboard/admin/customers/page.tsx` | New — searchable customer list |
| `app/dashboard/admin/customers/[id]/page.tsx` | New — customer detail: timeline, profile, tags, consent, notes |
| `services/staff-client.ts` | New (promoted from `features/knowledge-base/`) — `checkIsStaff()` |
| `hooks/use-staff-gate.ts` | New (promoted alongside it) — `useStaffGate()` |
| `features/knowledge-base/hooks.ts` | Simplified — no longer does its own staff check |
| `app/dashboard/admin/knowledge/page.tsx` | Simplified — relies on the new layout's gate |

## Verification

Same approach as every prior phase (Browser pane doesn't composite frames in this
environment — see PHASE-2-1-CONSENT.md). Full flow tested directly against the
running server and live database:

```
POST /api/customers                         → test customer created
POST /api/consent  (grant EMAIL/SUPPORT)     → generates a CONSENT_CHANGED interaction

GET  /api/crm/customers?staffEmail=<non-staff>  → 403 Not authorized
GET  /api/crm/customers?staffEmail=<staff>&q=... → test customer found

GET  /api/crm/customers/[id]?staffEmail=<staff> → detail shows the 1 prior interaction
POST .../tags   { name: "VIP" }                 → tag created + attached
POST .../notes  { body: "Called about..." }     → note created + NOTE_ADDED interaction

GET  /api/crm/customers/[id]?staffEmail=<staff> → tag present, note present,
                                                    timeline shows BOTH interactions
                                                    (the Phase-1-era consent change AND
                                                    the new note) in correct chronological
                                                    order — confirming one shared timeline
                                                    across phases, not per-phase silos

POST .../notes  (non-staff email)               → 403 Not authorized
DELETE .../tags { tagId }                       → tag removed, confirmed via re-fetch
```

Test customer, consent, note, interactions, and the orphaned `VIP` tag were deleted
afterward. `npm run verify` (typecheck + lint + 67 tests + build) is green.

**Still worth doing when the Browser pane is actively visible:** confirm the customer
list/detail pages render correctly, the tag/note forms behave as expected visually,
and the admin sub-nav highlights the active page — same caveat as every phase so far.

## What's next

**Phase 5 — Automated Communication (Email/SMS/WhatsApp outbound)**: the consent
gate (Phase 1), the timeline (Phase 0), and the CRM view of a customer (this phase)
all exist now specifically so this phase has something to check and log against
before it sends its first real message.
