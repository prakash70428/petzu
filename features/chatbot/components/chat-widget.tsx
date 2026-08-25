"use client";

import { MessageCircle, PawPrint, Send, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/features/auth/store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/utils/cn";
import { useChat } from "../hooks";

function ChatBubble({ role, content }: { role: "USER" | "ASSISTANT" | "SYSTEM"; content: string }) {
  const isUser = role === "USER";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-body-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {content}
      </div>
    </div>
  );
}

function ChatPanel() {
  const { messages, loading, sending, sendMessage } = useChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    void sendMessage(draft);
    setDraft("");
  }

  return (
    <>
      <div ref={scrollRef} className="flex h-80 flex-col gap-2 overflow-y-auto p-4">
        {loading ? (
          <p className="text-caption text-muted-foreground">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-caption text-muted-foreground">
            Ask about orders, bookings, or pet care — a PetZu assistant will help.
          </p>
        ) : (
          messages.map((message) => <ChatBubble key={message.id} role={message.role} content={message.content} />)
        )}
        {sending && <p className="text-caption text-muted-foreground">Typing...</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-body-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
        />
        <Button type="submit" size="icon" disabled={sending || !draft.trim()} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </form>
    </>
  );
}

function SignInPrompt() {
  return (
    <div className="flex h-80 flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-body-sm text-muted-foreground">Sign in to chat with a PetZu support assistant.</p>
      <Button asChild size="sm">
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}

/**
 * Global floating chat widget, mounted once in AppProviders. Gated behind
 * `useMounted()` because it reads the localStorage-backed session — without
 * this guard, the server-rendered markup (always logged-out) would mismatch
 * the client's first paint for anyone with a persisted session.
 */
export function ChatWidget() {
  const mounted = useMounted();
  const { isAuthenticated } = useSession();
  const [open, setOpen] = useState(false);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <Card className="w-80 overflow-hidden p-0 shadow-xl">
          <div className="flex items-center justify-between border-b bg-gradient-brand px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <PawPrint className="size-4" aria-hidden />
              <span className="text-body-sm font-medium">PetZu Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>
          {isAuthenticated ? <ChatPanel /> : <SignInPrompt />}
        </Card>
      )}
      <Button
        size="icon"
        variant="gradient"
        className="size-14 rounded-full shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}
