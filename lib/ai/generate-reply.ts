import { CHAT_MODEL, getAnthropicClient } from "./anthropic-client";
import { searchKnowledge } from "./knowledge-retrieval";
import { offlineReply } from "./offline-reply";
import { buildSystemPrompt } from "./system-prompt";

export interface ChatTurn {
  role: "USER" | "ASSISTANT";
  content: string;
}

/** Shown when the model declines a message (stop_reason "refusal") even after the fallback model. */
export const CHATBOT_REFUSAL_MESSAGE =
  "Sorry, I can't help with that one here. For anything else about your pet or PetZu, just ask, or reach the team through /contact.";

/**
 * Models that accept the server-side `fallbacks: "default"` refusal rescue.
 * `ANTHROPIC_CHAT_MODEL` can point anywhere, so only send the parameter when
 * the configured model is known to accept it.
 */
const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-opus-5", "claude-fable-5-1", "claude-sonnet-5-5"]);

/**
 * Shared by the web chat widget (streams `onDelta` chunks to the browser)
 * and the WhatsApp webhook (only needs the final string). Both ground the
 * model in the site guide + knowledge base. Without an `ANTHROPIC_API_KEY`,
 * or if the API fails before any text arrives, they answer from
 * `offlineReply()`, which points to the right page instead of a dead end.
 */
export async function generateReply(
  userMessage: string,
  priorMessages: ChatTurn[],
  onDelta?: (text: string) => void,
): Promise<string> {
  const anthropic = getAnthropicClient();

  const fallback = () => {
    const text = offlineReply(userMessage);
    onDelta?.(text);
    return text;
  };

  if (!anthropic) return fallback();

  const knowledgeMatches = await searchKnowledge(userMessage).catch(() => []);
  const useFallbacks = FALLBACK_MODELS.has(CHAT_MODEL);
  let fullText = "";

  const stream = anthropic.beta.messages.stream({
    model: CHAT_MODEL,
    // Room for adaptive thinking plus a chat-sized answer.
    max_tokens: 4096,
    // Support chat is latency-sensitive and rarely needs deep reasoning.
    output_config: { effort: "low" },
    system: buildSystemPrompt(knowledgeMatches),
    messages: priorMessages.map((turn) => ({
      role: turn.role === "ASSISTANT" ? ("assistant" as const) : ("user" as const),
      content: turn.content,
    })),
    ...(useFallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
  });

  stream.on("text", (delta) => {
    fullText += delta;
    onDelta?.(delta);
  });

  let final;
  try {
    final = await stream.finalMessage();
  } catch (error) {
    // Mid-answer failures keep what was already streamed; before that, answer offline.
    if (fullText.trim()) throw error;
    console.error("Chat model unavailable, answering offline:", error);
    return fallback();
  }
  if (final.stop_reason === "refusal" && !fullText.trim()) {
    onDelta?.(CHATBOT_REFUSAL_MESSAGE);
    return CHATBOT_REFUSAL_MESSAGE;
  }
  return fullText;
}
