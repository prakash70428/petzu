"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { fetchConversation, streamChatReply } from "./services/chat-service";
import type { ChatMessage } from "./types";

function localId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Loads any existing conversation on mount and exposes `sendMessage()`,
 * which appends the user's message immediately (optimistic) and streams the
 * assistant's reply in as it arrives, growing one message's content in
 * place rather than waiting for the full response.
 */
export function useChat() {
  const { user } = useSession();
  const email = user?.email;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  // Starts true; only ever flipped from a .then/.catch/.finally callback,
  // never from a bare effect-body call — see features/consent/hooks.ts for
  // why this codebase's lint config requires that shape.
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!email) return;
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
  }, [email]);

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
      let assistantStarted = false;

      try {
        await streamChatReply({ email, message: trimmed, conversationId }, (event) => {
          if (event.type === "init") {
            setConversationId(event.conversationId);
          } else if (event.type === "delta") {
            setMessages((prev) => {
              if (!assistantStarted) {
                assistantStarted = true;
                return [
                  ...prev,
                  { id: assistantId, role: "ASSISTANT", content: event.text, createdAt: new Date().toISOString() },
                ];
              }
              return prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + event.text } : m));
            });
          } else if (event.type === "error") {
            toast({ title: event.message, variant: "destructive" });
          }
        });
      } finally {
        setSending(false);
      }
    },
    [email, conversationId, sending],
  );

  return { messages, loading, sending, sendMessage, ready: Boolean(email) };
}
