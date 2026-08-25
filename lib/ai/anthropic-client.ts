import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/**
 * Returns `null` when `ANTHROPIC_API_KEY` isn't set, rather than throwing —
 * this is the same "adapter degrades gracefully without a key" pattern used
 * for every other external-dependent piece of this build (see the
 * credentials matrix in the approved plan). `app/api/chat/route.ts` checks
 * for `null` and returns an explanatory message instead of calling the API,
 * so `npm run build`/`verify` never need a real key to stay green.
 */
export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  if (!client) client = new Anthropic({ apiKey });
  return client;
}

/** Overridable via env so a cheaper/newer model can be swapped without a code change. */
export const CHAT_MODEL = process.env.ANTHROPIC_CHAT_MODEL ?? "claude-sonnet-5";

/** Shared between the web chat widget (app/api/chat) and the WhatsApp webhook (app/api/whatsapp/webhook) — both fall back to this when `getAnthropicClient()` returns null. */
export const CHATBOT_NOT_CONFIGURED_MESSAGE =
  "The chatbot isn't fully set up yet — an administrator needs to add an ANTHROPIC_API_KEY. In the meantime, please reach out to PetZu support directly.";
