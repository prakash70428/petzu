"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { fetchConversation, streamChatReply } from "./services/chat-service";
import type { ChatMessage } from "./types";

function localId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ChatIdentity {
  email: string;
  name?: string;
  /**
   * Only signed-in members get their past conversation reloaded. A guest
   * typed an email we can't verify, so showing "their" history would let
   * anyone read someone else's chat by typing that person's email.
   */
  loadHistory: boolean;
}

/**
 * Loads any existing conversation on mount and exposes `sendMessage()`,
 * which appends the user's message immediately (optimistic) and streams the
 * assistant's reply in as it arrives, growing one message's content in
 * place rather than waiting for the full response.
 */
export function useChat({ email, name, loadHistory }: ChatIdentity) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  // Starts true; only ever flipped from a .then/.catch/.finally callback,
  // never from a bare effect-body call — see features/consent/hooks.ts for
  // why this codebase's lint config requires that shape.
  const [loading, setLoading] = useState(loadHistory);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loadHistory) return;
    let cancelled = false;

    fetchConversation(email)
      .then((data) => {
        if (cancelled || !data) return;
        setConversationId(data.conversationId);
        setMessages(data.messages);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Couldn't load your conversation", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [email, loadHistory]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!email || !trimmed || sending) return;

      setMessages((prev) => [
        ...prev,
        { id: localId("user"), role: "USER", content: trimmed, createdAt: new Date().toISOString() },
      ]);
      setSending(true);

      const assistantId = localId("assistant");

      try {
        await streamChatReply({ email, name, message: trimmed, conversationId }, (event) => {
          if (event.type === "init") {
            setConversationId(event.conversationId);
          } else if (event.type === "delta") {
            // Pure updater: React may run it twice (StrictMode), so decide
            // "first chunk or not" from `prev`, never from an outside flag.
            setMessages((prev) =>
              prev.some((m) => m.id === assistantId)
                ? prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + event.text } : m))
                : [...prev, { id: assistantId, role: "ASSISTANT", content: event.text, createdAt: new Date().toISOString() }],
            );
          } else if (event.type === "error") {
            toast({ title: event.message, variant: "destructive" });
          }
        });
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "ASSISTANT",
            content: "Sorry, I couldn't reply just now. Please try again in a moment, or reach the team at /contact.",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [email, name, conversationId, sending],
  );

  return { messages, loading, sending, sendMessage, ready: Boolean(email) };
}
