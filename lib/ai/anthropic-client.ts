import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/**
 * Returns `null` when `ANTHROPIC_API_KEY` isn't set, rather than throwing —
 * this is the same "adapter degrades gracefully without a key" pattern used
 * for every other external-dependent piece of this build (see the
 * credentials matrix in the approved plan). `generateReply()` answers from
 * `offlineReply()` instead when this is `null`, so `npm run build`/`verify`
 * never need a real key to stay green.
 */
export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  if (!client) client = new Anthropic({ apiKey });
  return client;
}

/** Overridable via env so a cheaper/newer model can be swapped without a code change. */
export const CHAT_MODEL = process.env.ANTHROPIC_CHAT_MODEL ?? "claude-opus-5-5";

