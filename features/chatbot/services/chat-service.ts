import { apiClient } from "@/services/api-client";
import type { ChatMessage, ChatStreamEvent } from "../types";

export function fetchConversation(email: string) {
  return apiClient<{ data: { conversationId: string; messages: ChatMessage[] } | null }>(
    `/api/chat?email=${encodeURIComponent(email)}`,
  ).then((res) => res.data);
}

/**
 * POSTs a message and reads the NDJSON stream back (one JSON object per
 * line — see `app/api/chat/route.ts`'s `encodeEvent`), invoking `onEvent`
 * for each parsed event as it arrives. Not built on `apiClient()` because
 * that helper always awaits the full JSON body; a streaming reply needs the
 * raw `Response.body` reader instead.
 */
export async function streamChatReply(
  payload: { email: string; message: string; conversationId?: string },
  onEvent: (event: ChatStreamEvent) => void,
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    onEvent({ type: "error", message: "Couldn't reach the chat service." });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      onEvent(JSON.parse(line) as ChatStreamEvent);
    }
  }
}
