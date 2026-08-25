# Phase 2.5 — Automated Communication

Sixth milestone. The first phase that actually sends something to a real inbox or
phone (once credentials are added) — everything before this recorded, gated, and
displayed data; this phase acts on it.

---

## Why this phase exists

Order confirmations, appointment reminders, a welcome note — none of it happens
today. The dashboard's old "notifications" were `useState` that reset on reload
(fixed properly in Phase 8, but even before that: nothing was ever actually
*delivered* anywhere outside the app). This phase builds the one thing every future
trigger — order placed, appointment booked, feedback acknowledged, Phase 6's WhatsApp
auto-replies — will call: a single `sendMessage()` that's consent-gated, logged, and
channel-agnostic.

## What was built

```prisma
model MessageLog {
  customerId  String
  channel     ConsentChannel     // EMAIL | SMS | WHATSAPP
  purpose     ConsentPurpose     // MARKETING | TRANSACTIONAL | SUPPORT
  templateKey String
  status      MessageStatus      // QUEUED | SENT | FAILED | SKIPPED_NO_CONSENT
  providerId  String?
  error       String?
  sentAt      DateTime?
}
```

`lib/comms/dispatcher.ts`'s `sendMessage()`, three adapters (Resend for email, MSG91
for SMS, Meta Cloud API for WhatsApp — outbound-template-only, two-way is Phase 6),
three starter templates, and one real trigger: a welcome email attempt on first-time
customer creation.

## How it works

### Why every purpose is consent-gated, no exceptions

The original plan sketch for this phase suggested skipping the consent check for
`TRANSACTIONAL` sends — the reasoning being that order confirmations feel obviously
fine to send. This build does **not** do that. `PHASE-2-1-CONSENT.md` already decided,
before this phase existed, that "absence of a row means not granted" would hold
consistently with no carve-outs — specifically because WhatsApp's opt-in requirement
doesn't exempt transactional messages sent outside a session window either. Building
one exception into the dispatcher now would mean either two different consent
policies existing in the same app, or rewriting this phase later when Phase 6's real
WhatsApp constraints made the inconsistency obvious. `sendMessage()` checks consent
for every purpose, unconditionally.

### Why the welcome trigger usually skips (and that's correct)

`app/api/customers/route.ts` now attempts a welcome email the first time a customer
row is created. A brand-new customer has no `Consent` row yet — so, per the rule
above, that first send is *expected* to land as `SKIPPED_NO_CONSENT`, not `SENT`.
Verified directly (see below): creating a fresh test customer produced exactly that.
This might look like "the feature doesn't work" at first glance, but it's the
opposite — it's proof the consent gate holds even for the very first automated
message an account ever triggers, not just the ones a developer remembered to check.

### Every adapter degrades to `QUEUED`, never throws past the dispatcher

`AdapterNotConfiguredError` (`lib/comms/types.ts`) is a distinct case from a real
provider failure. `sendEmail`/`sendSms`/`sendWhatsApp` throw it when their env vars
are missing; the dispatcher catches specifically that and logs `QUEUED` with the
exact missing-var message, versus a genuine send failure (bad request, provider
outage) landing as `FAILED` with the provider's error. Verified directly: granting
consent and re-sending the same welcome message (no `RESEND_API_KEY` set) produced
`status: "QUEUED", error: "RESEND_API_KEY is not set"` — not a crash, not a silent
no-op, a clearly diagnosable row. The moment real credentials exist, the exact same
call succeeds with no code change — same pattern as Phase 3's chatbot.

### `Interaction` only logs a completed send

`recordInteraction()` is called from exactly one place in the dispatcher: right after
a successful adapter call. `SKIPPED_NO_CONSENT` and the not-configured `QUEUED` path
do **not** write to the timeline — confirmed directly (the second test above shows
only the earlier `CONSENT_CHANGED` interaction, nothing new from the attempted send).
This matters for what Phase 4's CRM timeline actually claims: it says "we sent this,"
not "we tried." `MessageLog` is the complete attempt history (including the misses);
`Interaction` stays a record of what actually happened.

### WhatsApp template names are illustrative

`welcome_message`, `order_confirmation`, `appointment_reminder` in
`lib/comms/templates/*.ts` are placeholder names. WhatsApp Business Platform requires
every business-initiated template to be submitted and approved in Meta Business
Manager before it can be used — there's no way to make this adapter "just work" with
a fresh Meta account the way Resend/MSG91 can with just an API key. Getting real
templates approved is on you, not something this build can complete without your
Meta Business account.

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Added `MessageLog`, `MessageStatus` |
| `lib/comms/types.ts` | New — `SendPayload`, `SendResult`, `Adapter`, `AdapterNotConfiguredError` |
| `lib/comms/dispatcher.ts` | New — `sendMessage()`, the single entry point |
| `lib/comms/adapters/email-resend.ts` | New — Resend SDK |
| `lib/comms/adapters/sms-msg91.ts` | New — MSG91 Flow API (plain `fetch`) |
| `lib/comms/adapters/whatsapp-meta.ts` | New — Meta Cloud API (plain `fetch`) |
| `lib/comms/templates/` | New — `welcome`, `order-confirmation`, `appointment-reminder` |
| `app/api/customers/route.ts` | Edited — dispatches a welcome email on first-time creation |
| `package.json` | Added `resend` |
| `.env.example` | Documented `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `MSG91_AUTH_KEY`, `MSG91_SENDER_ID` with real usage notes |

## Verification

Same approach as every prior phase (Browser pane doesn't composite frames — see
PHASE-2-1-CONSENT.md). Tested directly against the running server and live database,
with **zero external comms credentials configured**, to prove both degradation paths:

```
POST /api/customers  (brand-new email)
  → customer created
  → MessageLog: { status: "SKIPPED_NO_CONSENT", ... }   (no consent row exists yet)

POST /api/consent  (grant EMAIL/TRANSACTIONAL)
  → Interaction: CONSENT_CHANGED

sendMessage() called again directly (same customer, same template)
  → MessageLog: { status: "QUEUED", error: "RESEND_API_KEY is not set" }
  → Interaction: still only the one CONSENT_CHANGED row — the send attempt
                 itself did NOT create a new interaction, confirming the
                 timeline only records completed sends
```

Test customer, consent, message logs, and interactions deleted afterward. `npm run
verify` (typecheck + lint + 67 tests + build) is green.

**What this doesn't prove:** that a real send actually reaches an inbox or phone —
that needs real Resend/MSG91/Meta credentials, which (per the credentials matrix in
the approved plan) only you can provide. Once `RESEND_API_KEY` is set, the exact same
`sendMessage()` call above would produce `status: "SENT"` with a real Resend message
id — no code changes needed.

## What's next

**Phase 6 — WhatsApp Business (two-way)**: the inbound webhook, the 24h session
window, and routing an inbound message to Phase 3's chatbot for an automatic reply —
sent back out through this phase's `sendWhatsApp` adapter.
