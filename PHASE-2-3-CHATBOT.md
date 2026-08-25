# Phase 2.3 — AI Chatbot (Claude API)

Fourth milestone. The first phase whose primary user-facing surface is visible on
every page — a floating chat widget — and the first that depends on a paid,
external, no-free-tier API (unlike Postgres/Mongo, Anthropic has no forever-free
tier, so this is the first phase you need to actively fund to see it fully working).

---

## Why this phase exists

Customer support that only runs during business hours, and only through a form or
phone call, loses people who have a quick question at 11pm. A grounded chatbot
answers the common cases (order status questions, "do you deliver to my city,"
general pet-care basics) instantly, and — because it's grounded in Phase 2's
knowledge base rather than improvising — it can honestly say "I don't know, here's
how to reach support" instead of inventing a policy that doesn't exist.

## What was built

```prisma
model ChatConversation {
  customerId String?
  channel    ChatChannel @default(WEB)   // WEB | WHATSAPP
  messages   ChatMessage[]
}
model ChatMessage {
  conversationId String
  role           ChatRole   // USER | ASSISTANT | SYSTEM
  content        String
}
```

A floating widget (bottom-right, every page) backed by a streaming API route. Signed-
in visitors get a live conversation; signed-out visitors see a "sign in to chat"
prompt instead of a broken widget, because the backend has no way to attach a
conversation to nobody.

## How it works

### One conversation model, two channels, on purpose

`ChatConversation.channel` defaults to `WEB` but already has a `WHATSAPP` option that
nothing writes to yet. This isn't speculative — Phase 6 needs exactly this table for
inbound WhatsApp messages, and building one conversation/message model that both
channels share (rather than a `WebChat` table now and a parallel `WhatsAppChat` table
in Phase 6) means Phase 6's chatbot integration is "create a conversation with
`channel: WHATSAPP` instead of `WEB`," not a second implementation of message
storage.

### Grounding: search first, then answer

Every message triggers `searchKnowledge()` from Phase 2 before the model is called.
The top matches get formatted into the system prompt
(`lib/ai/system-prompt.ts`), with an explicit instruction: use the reference material
for anything PetZu-specific, and say "I don't know" rather than invent a policy,
price, or delivery timeline that isn't in it. General pet-care questions (not
PetZu-specific) are allowed to draw on the model's own knowledge — the goal is
avoiding confidently wrong claims *about PetZu*, not refusing to be useful.

### Streaming, over a plain NDJSON body

The response isn't Server-Sent Events (`text/event-stream`) — it's one JSON object
per line (`{"type":"init",...}\n{"type":"delta",...}\n...{"type":"done"}\n`), read
client-side with `response.body.getReader()`. SSE's extra framing (`event:`/`data:`
prefixes, the `EventSource` API's inability to send a POST body directly) buys
nothing here since both ends are code this build controls — NDJSON is simpler to
both write and parse. `init` carries the conversation id back to the client (so the
next message in the same session continues the thread instead of starting a new
one), `delta` events carry each text chunk as it streams from Anthropic, `done`
closes it out, and `error` reports a failure without leaving the connection hanging.

### Never blocks `npm run build`/`verify` on a missing API key

`lib/ai/anthropic-client.ts`'s `getAnthropicClient()` returns `null` when
`ANTHROPIC_API_KEY` isn't set, rather than throwing. The route checks for `null` and
streams back a plain "the chatbot isn't fully configured yet, please contact support"
message — persisted as a real `ChatMessage` like any other reply, so the conversation
history stays consistent whether or not a key is configured. Verified directly (see
below): the entire pipeline — customer resolution, conversation creation, message
persistence, streaming response format — works correctly with **zero** Anthropic
credentials. The moment a real `ANTHROPIC_API_KEY` is added, the exact same code path
starts calling Claude for real; nothing else changes.

### Every turn lands on the CRM timeline

Both the user's message and the assistant's reply call `recordInteraction()`
(truncated to 120 characters as the timeline summary) — the same function every prior
phase uses. Phase 4's CRM will show a customer's chat history inline with their
consent changes and (later) their orders, without Phase 4 needing to write any new
logging.

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Added `ChatConversation`, `ChatMessage`, `ChatChannel`, `ChatRole` |
| `lib/ai/anthropic-client.ts` | New — `getAnthropicClient()` (null-safe), `CHAT_MODEL` |
| `lib/ai/system-prompt.ts` | New — `buildSystemPrompt()`, injects KB matches |
| `app/api/chat/route.ts` | New — `GET` (load history) / `POST` (streaming NDJSON reply) |
| `features/chatbot/` | New — `types.ts`, `services/chat-service.ts`, `hooks.ts` (`useChat()`), `components/chat-widget.tsx` |
| `components/providers/index.tsx` | Added `<ChatWidget />` to the composition root |
| `package.json` | Added `@anthropic-ai/sdk` |

## Verification

Same approach as Phases 1–2 (this environment's Browser pane doesn't composite
frames, so the widget's open/close animation can't be visually confirmed here — see
PHASE-2-1-CONSENT.md for the full explanation). Tested the entire pipeline directly
against the running server and the live database, **without an `ANTHROPIC_API_KEY`
configured**, to prove the no-key fallback works end to end:

```
GET  /api/chat?email=phase3test@petzu.world
  → { data: null }                         (no conversation yet)

POST /api/chat  { email, message: "What is your return policy?" }
  → {"type":"init","conversationId":"..."}
  → {"type":"delta","text":"The chatbot isn't fully set up yet..."}
  → {"type":"done"}

GET  /api/chat?email=phase3test@petzu.world
  → conversation with both messages persisted (USER + ASSISTANT), in order
```

Test customer, conversation, and messages deleted afterward. `npm run verify`
(typecheck + lint + 67 tests + build) is green.

**What this doesn't prove:** that a real `ANTHROPIC_API_KEY` produces good, correctly
grounded answers — that needs an actual key, which the credentials matrix in the
approved plan always flagged as something only you can provide (Anthropic has no
forever-free tier, unlike Postgres/Mongo). To try it for real:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com).
2. Add `ANTHROPIC_API_KEY=sk-ant-...` to your local `.env` (never share this key in
   chat or commit it — treat it like a password).
3. Restart `npm run dev` and open the chat widget on any page while signed in.

**Still worth doing when the Browser pane is actively visible:** confirm the widget's
open/close button, message bubbles, and streaming "typing" indicator render and
animate correctly — same caveat as every phase so far.

## What's next

**Phase 4 — In-house CRM**: mostly a UI phase now — `Interaction` has been
accumulating real data since Phase 1 (consent changes, chat messages), so this
becomes "build the staff view that reads it," plus `Note`/`Tag` for staff-added
context and reusing this phase's `isStaff()`/`/api/staff` for the CRM's own access
gate.
