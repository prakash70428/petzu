export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export type ChatStreamEvent =
  | { type: "init"; conversationId: string }
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };
