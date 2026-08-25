import { CHAT_MODEL, CHATBOT_NOT_CONFIGURED_MESSAGE, getAnthropicClient } from "./anthropic-client";
import { searchKnowledge } from "./knowledge-retrieval";
import { buildSystemPrompt } from "./system-prompt";

export interface ChatTurn {
  role: "USER" | "ASSISTANT";
  content: string;
}

/**
 * Shared by the web chat widget (streams `onDelta` chunks to the browser)
 * and the WhatsApp webhook (only needs the final string) — both grounding
 * in the knowledge base and falling back to the same "not configured"
 * message when no `ANTHROPIC_API_KEY` is set belong in one place, not
 * duplicated between `app/api/chat/route.ts` and
 * `app/api/whatsapp/webhook/route.ts`.
 */
export async function generateReply(
  userMessage: string,
  priorMessages: ChatTurn[],
  onDelta?: (text: string) => void,
): Promise<string> {
  const anthropic = getAnthropicClient();

  if (!anthropic) {
    onDelta?.(CHATBOT_NOT_CONFIGURED_MESSAGE);
    return CHATBOT_NOT_CONFIGURED_MESSAGE;
  }

  const knowledgeMatches = await searchKnowledge(userMessage);
  const system = buildSystemPrompt(knowledgeMatches);
  let fullText = "";

  const stream = anthropic.messages.stream({
    model: CHAT_MODEL,
    max_tokens: 1024,
    system,
    messages: priorMessages.map((turn) => ({
      role: turn.role === "ASSISTANT" ? ("assistant" as const) : ("user" as const),
      content: turn.content,
    })),
  });

  stream.on("text", (delta) => {
    fullText += delta;
    onDelta?.(delta);
  });

  await stream.finalMessage();
  return fullText;
}
