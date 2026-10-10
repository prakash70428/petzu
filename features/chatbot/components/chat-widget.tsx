"use client";

import { Maximize2, MessageCircle, Minimize2, PawPrint, Send, X } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/features/auth/store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/utils/cn";
import { setChatGuest, useChatGuest } from "../guest-store";
import { type ChatIdentity, useChat } from "../hooks";
import { splitMessageLinks } from "../utils";

function ChatBubble({ role, content }: { role: "USER" | "ASSISTANT" | "SYSTEM"; content: string }) {
  const isUser = role === "USER";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-body-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {isUser
          ? content
          : splitMessageLinks(content).map((part, index) =>
              part.type === "text" ? (
                part.value
              ) : part.type === "internal" ? (
                <Link key={index} href={part.value} className="font-medium text-primary underline underline-offset-2">
                  {part.value}
                </Link>
              ) : (
                <a
                  key={index}
                  href={part.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  {part.value}
                </a>
              ),
            )}
      </div>
    </div>
  );
}

/**
 * Sizes itself: compact before the first message, then taller and wider
 * once a conversation is going (client feedback: the box felt too small to
 * actually chat in), and larger again when the visitor expands it.
 */
function ChatPanel({ identity, expanded }: { identity: ChatIdentity; expanded: boolean }) {
  const { messages, loading, sending, sendMessage } = useChat(identity);
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

  const chatting = messages.length > 0;

  return (
    <div
      className={cn(
        "flex max-w-[calc(100vw-2.5rem)] flex-col transition-[width] duration-200 ease-premium",
        expanded ? "w-[36rem]" : chatting ? "w-[26rem]" : "w-80",
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          "flex flex-col gap-2 overflow-y-auto p-4 transition-[height] duration-200 ease-premium",
          expanded ? "h-[min(36rem,65vh)]" : chatting ? "h-[min(26rem,55vh)]" : "h-72",
        )}
      >
        {loading ? (
          <p className="text-caption text-muted-foreground">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-caption text-muted-foreground">
            Ask about orders, bookings, or pet care. A PetZu assistant will help.
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
      {chatting && (
        <p className="px-4 pb-2.5 text-center text-caption text-muted-foreground">
          Still stuck?{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact the PetZu team
          </Link>
        </p>
      )}
    </div>
  );
}

const fieldClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-body-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

/**
 * Signed-out visitors start chatting with just a name and email instead of
 * hitting a sign-in wall: far less effort for them, and support still gets
 * a contact to follow up with (stored as a Customer via the chat API).
 */
function GuestStartForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return setError("Please tell us your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Please enter a valid email");
    setChatGuest({ name: name.trim(), email: email.trim().toLowerCase() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 p-4">
      <p className="text-body-sm text-foreground">Hi! Tell us who you are and ask us anything.</p>
      <label className="flex flex-col gap-1 text-caption text-muted-foreground">
        Name
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          autoComplete="name"
          maxLength={80}
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-caption text-muted-foreground">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
          }}
          autoComplete="email"
          className={fieldClass}
        />
      </label>
      {error && <p className="text-caption text-destructive">{error}</p>}
      <Button type="submit" variant="gradient" size="sm">
        Start chat
      </Button>
      <p className="text-caption text-muted-foreground">
        We&apos;ll only use your email to reply. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

function MemberLinks() {
  return (
    <p className="border-t px-4 py-2.5 text-center text-caption text-muted-foreground">
      Already part of the community?{" "}
      <Link href="/sign-in" className="font-medium text-primary hover:underline">
        Sign in
      </Link>{" "}
      or{" "}
      <Link href="/sign-up" className="font-medium text-primary hover:underline">
        create an account
      </Link>
    </p>
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
  const { isAuthenticated, user } = useSession();
  const guest = useChatGuest();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!mounted) return null;

  const identity: ChatIdentity | null =
    isAuthenticated && user
      ? { email: user.email, name: user.name, loadHistory: true }
      : guest
        ? { email: guest.email, name: guest.name, loadHistory: false }
        : null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <Card className="overflow-hidden p-0 shadow-xl">
          <div className="flex items-center justify-between border-b bg-gradient-brand px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <PawPrint className="size-4" aria-hidden />
              <span className="text-body-sm font-medium">PetZu Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              {identity && (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  aria-label={expanded ? "Shrink chat" : "Expand chat"}
                  className="hidden rounded-md p-1 hover:bg-white/10 sm:block"
                >
                  {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-md p-1 hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
          {identity ? (
            <ChatPanel key={identity.email} identity={identity} expanded={expanded} />
          ) : (
            <div className="w-80 max-w-[calc(100vw-2.5rem)]">
              <GuestStartForm />
            </div>
          )}
          {!isAuthenticated && (
            <div className={identity ? undefined : "w-80 max-w-[calc(100vw-2.5rem)]"}>
              <MemberLinks />
            </div>
          )}
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
