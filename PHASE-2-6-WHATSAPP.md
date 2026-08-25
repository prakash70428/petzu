# Phase 2.6 — WhatsApp Business (two-way)

Seventh milestone, and the one the plan flagged from the start as "the hard,
WhatsApp-specific part" — everything before this (Phase 5) could only ever send
outbound. This phase closes the loop: a customer messages PetZu on WhatsApp, and gets
a real chatbot reply back, automatically.

---

## Why this phase exists

Phase 5 built outbound WhatsApp sending, but only pre-approved templates — that's all
Meta allows for a business-initiated message. A customer who messages PetZu directly
opens something different: a 24-hour "customer service window" where free-form
replies are allowed without a template, no consent gate required (the customer's own
message is what authorizes the reply). Nothing in Phases 0–5 could receive that
message in the first place — this phase is the inbound half.

## The phone-only identity gap

This is worth stating plainly, the same way `PHASE-2-0-FOUNDATION.md` was honest
about the email-based identity bridge's limits: **WhatsApp gives us a phone number,
never an email.** Every identity decision since Phase 0 has been keyed by email —
`Customer.email` is the unique bridge field, and nothing about that changes here. So
when a message arrives from a number that doesn't match any `Customer.phone` on
file, there is genuinely no `Customer` to attach it to.

The fix isn't inventing a synthetic email or forcing a `Customer` row into existence
from a bare phone number — that would create fake-looking accounts with no real
identity behind them. Instead, `ChatConversation` got a `whatsappPhone` field (see
Phase 3's schema): a WhatsApp conversation can exist, get real chatbot replies, and
keep its own history, entirely independent of whether a `Customer` was ever
resolved. Verified directly (below): a message from an unrecognized number produced
a conversation with `customerId: null` — the reply still worked, it just doesn't
show up in anyone's CRM timeline (Phase 4) yet. If that same phone number later gets
added to a real `Customer` record (e.g., a signed-in visitor adds their number in
Profile settings), a subsequent message from them links up automatically — the
lookup is a live phone match, not a one-time decision baked in at first contact.

## What was built

- `GET /api/whatsapp/webhook` — Meta's one-time verification handshake.
- `POST /api/whatsapp/webhook` — inbound message handling: resolve/create the
  conversation, save the message, generate a reply via Phase 3's chatbot (grounded in
  Phase 2's knowledge base, using the exact same `generateReply()` the web widget
  uses — extracted from Phase 3's route into `lib/ai/generate-reply.ts` this phase so
  neither entry point duplicates the model-calling logic), send it back.
- `verifyWebhookSignature()` and `parseWebhookPayload()` in
  `lib/comms/adapters/whatsapp-meta.ts`.
- `sendWhatsAppSessionReply()` — the free-form, non-template, non-consent-gated
  sender used only for replying inside the session window.

## How it works

### Signature verification is opt-in until configured

Meta signs every webhook POST with `X-Hub-Signature-256`, an HMAC-SHA256 of the raw
body keyed with the app secret — this is what stops anyone from POSTing fake
messages to the endpoint. `verifyWebhookSignature()` returns `true` (accepts
unverified) when `WHATSAPP_APP_SECRET` isn't set, matching this build's rule that no
external credential is ever required for the code to run. **This is not a safe
default for a real deployment** — it's specifically a "the code works before you've
configured anything, and gets strictly safer the moment you do" trade-off, the same
shape as every other adapter's `AdapterNotConfiguredError`, except a missing webhook
secret means *reduced* security rather than *no* functionality. Verified directly:
with `WHATSAPP_APP_SECRET` set, a request with a correctly computed HMAC succeeded
(200) and one with a wrong signature was rejected (401, before the payload was even
parsed).

### Replies bypass the Phase 5 dispatcher on purpose

`sendWhatsAppSessionReply()` is a separate function from Phase 5's template-based
`sendWhatsApp` adapter, and this handler calls it directly — not through
`lib/comms/dispatcher.ts`'s `sendMessage()`. Two real reasons, not just convenience:
Meta's session-window replies use `type: "text"` (free text), not `type: "template"`,
which is a structurally different API call; and the dispatcher's consent gate exists
for *business-initiated* messages, which this isn't — a customer who just messaged
first is what authorizes the reply, per Meta's own policy. Running this through the
consent gate would mean an unresolved WhatsApp contact (no `Customer`, so no
`Consent` row could even exist) could never get a reply at all, which would break the
entire feature for exactly the situation it needs to handle most: a stranger writing
in for the first time.

### Every reply reuses Phase 3's brain, not a copy of it

`lib/ai/generate-reply.ts` is new this phase, extracted from what was inline in
`app/api/chat/route.ts`. The web widget passes an `onDelta` callback to stream tokens
to the browser; this webhook omits it and just awaits the final string. Same
knowledge-base grounding, same system prompt, same "not configured" fallback message
— one chatbot, two front doors. Verified directly: an inbound message with no
`ANTHROPIC_API_KEY` configured produced the exact same fallback text Phase 3's widget
returns, saved as a real `ChatMessage`, same as any other reply.

### Interactions log inbound and outbound separately, only when a customer exists

Both directions get logged (`WHATSAPP_MESSAGE`, with `metadata.direction: "inbound"`
or `"outbound"`) — but only when `customer` resolved. Verified directly: messaging
from a phone number matching an existing customer produced both interaction rows,
visible immediately through Phase 4's CRM detail endpoint, timestamped and ordered
correctly alongside whatever else was already in that customer's timeline.

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Added `ChatConversation.whatsappPhone` + index |
| `lib/ai/generate-reply.ts` | New — shared reply generation, extracted from Phase 3's route |
| `lib/ai/anthropic-client.ts` | Added `CHATBOT_NOT_CONFIGURED_MESSAGE` (shared constant) |
| `app/api/chat/route.ts` | Simplified — now calls `generateReply()` instead of inlining the Anthropic stream |
| `lib/comms/adapters/whatsapp-meta.ts` | Added `verifyWebhookSignature()`, `parseWebhookPayload()`, `sendWhatsAppSessionReply()` |
| `app/api/whatsapp/webhook/route.ts` | New — `GET` (verify) / `POST` (inbound handling) |
| `.env.example` | Documented `WHATSAPP_WEBHOOK_VERIFY_TOKEN` / `WHATSAPP_APP_SECRET`'s real purpose |

## Verification

Same approach as every prior phase (Browser pane doesn't composite frames — see
PHASE-2-1-CONSENT.md). Tested directly against the running server and live database:

```
GET  /api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=<correct>&hub.challenge=abc123
  → 200, body "abc123"
GET  ...&hub.verify_token=<wrong>...
  → 403 Forbidden

POST /api/whatsapp/webhook  (unrecognized phone, realistic Meta payload, no signature — no APP_SECRET configured)
  → 200 OK
  → ChatConversation created: customerId: null, whatsappPhone: "919876543210"
  → USER message saved (real inbound text)
  → ASSISTANT message saved (the "not configured" fallback — no ANTHROPIC_API_KEY)

POST /api/whatsapp/webhook  (phone matching an existing test Customer)
  → 200 OK
  → Conversation linked: customerId set correctly
  → GET /api/crm/customers/[id] shows BOTH WHATSAPP_MESSAGE interactions
    (inbound + outbound), correctly ordered — confirmed via Phase 4's CRM endpoint

WHATSAPP_APP_SECRET set, then:
POST ... with a correctly computed X-Hub-Signature-256   → 200 OK
POST ... with a deliberately wrong signature              → 401 Invalid signature
```

Test customers, conversations, messages, and interactions deleted afterward; the
temporary `WHATSAPP_WEBHOOK_VERIFY_TOKEN`/`WHATSAPP_APP_SECRET` test values used only
to exercise the signature check were removed from `.env` afterward too (they weren't
real Meta credentials, just strings used to prove the HMAC logic is correct). `npm
run verify` (typecheck + lint + 67 tests + build) is green.

**What this doesn't prove:** that Meta's real webhook infrastructure can reach this
endpoint, or that the illustrative template names from Phase 5 are actually approved
— that needs a real Meta Business account, phone number verification, and template
review, all of which the credentials matrix always flagged as something only you can
do (and which "can take days," per the approved plan's recommendation to start that
process early).

## What's next

**Phase 7 — Feedback & Complaint Tracking**: submission + staff triage, feeding both
the CRM timeline (Phase 4) and this build's comms dispatcher (Phase 5) for
acknowledgement messages.
