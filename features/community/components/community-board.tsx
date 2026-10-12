"use client";

import { MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/features/auth/store";
import { setChatGuest, useChatGuest } from "@/features/chatbot/guest-store";
import { speciesConfig } from "@/features/pet-profile/constants";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { createCommunityPost, createCommunityReply, fetchCommunityPosts } from "../api";
import {
  communitySpecies,
  communityTopics,
  newPostSchema,
  newReplySchema,
  type CommunityPostView,
  type CommunitySpecies,
  type CommunityTopic,
} from "../schema";

/** Name/email already given to the chat widget or account, so nobody types them twice. */
function useKnownAuthor() {
  const session = useSession();
  const guest = useChatGuest();
  if (session.user) return { name: session.user.name, email: session.user.email };
  return { name: guest?.name ?? "", email: guest?.email ?? "" };
}

/** Fills the form's name/email once a stored identity loads after the first render. */
function useSyncAuthor(
  author: { name: string; email: string },
  values: { name: string; email: string },
  setField: (field: "name" | "email", value: string) => void,
) {
  useEffect(() => {
    if (author.email && !values.email) {
      setField("email", author.email);
      if (!values.name) setField("name", author.name);
    }
  }, [author.email, author.name, values.email, values.name, setField]);
}

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days} d ago` : new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * The whole community in one client component: filter by animal and topic,
 * ask a question with just a name and email, and reply inline. Posts come
 * from the database (app/api/community); nothing here is sample content.
 */
export function CommunityBoard({ initialSpecies }: { initialSpecies?: CommunitySpecies }) {
  const [species, setSpecies] = useState<CommunitySpecies | "all">(initialSpecies ?? "all");
  const [topic, setTopic] = useState<CommunityTopic | "all">("all");
  const [posts, setPosts] = useState<CommunityPostView[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  /** Bumped after posting, to fetch the board again. */
  const [version, setVersion] = useState(0);
  const load = () => setVersion((v) => v + 1);

  useEffect(() => {
    let cancelled = false;
    fetchCommunityPosts(species === "all" ? undefined : species)
      .then((data) => {
        if (cancelled) return;
        setPosts(data);
        setLoadError(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPosts([]);
        setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [species, version]);

  const visible = posts?.filter((post) => topic === "all" || post.topic === topic) ?? null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0">
        <div className="flex flex-col gap-3">
          <FilterRow
            label="Animal"
            options={[{ value: "all", label: "All pets" }, ...communitySpecies.map((s) => ({ value: s, label: speciesConfig[s].label }))]}
            value={species}
            onChange={(value) => setSpecies(value as CommunitySpecies | "all")}
          />
          <FilterRow
            label="Topic"
            options={[{ value: "all", label: "Everything" }, ...communityTopics.map((t) => ({ value: t, label: t }))]}
            value={topic}
            onChange={(value) => setTopic(value as CommunityTopic | "all")}
          />
        </div>

        <div className="mt-8 flex flex-col divide-y divide-border border-y border-border">
          {visible === null &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 py-6">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}

          {visible !== null && visible.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-heading-4 font-semibold text-foreground">
                {loadError ? "The board couldn't load right now" : "No questions here yet"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-body-sm text-muted-foreground">
                {loadError
                  ? "Please refresh in a moment. You can still ask your question and it will show up once we're back."
                  : "Be the first to ask. Other pet parents and the PetZu team will see it."}
              </p>
            </div>
          )}

          {visible?.map((post) => <PostItem key={post.id} post={post} onReplied={load} />)}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <AskForm defaultSpecies={species === "all" ? undefined : species} onPosted={load} />
      </aside>
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="w-14 text-caption font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className="rounded-full border border-border px-3 py-1.5 text-body-sm text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PostItem({ post, onReplied }: { post: CommunityPostView; onReplied: () => void }) {
  const [open, setOpen] = useState(false);
  const replyCount = post.replies.length;

  return (
    <article className="py-6">
      <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
        <Badge variant="secondary">{speciesConfig[post.species]?.label ?? post.species}</Badge>
        <Badge variant="outline">{post.topic}</Badge>
        <span>
          {post.authorName} · {timeAgo(post.createdAt)}
        </span>
      </div>
      <h3 className="mt-3 text-heading-4 font-semibold text-foreground">{post.title}</h3>
      {post.body && <p className="mt-2 whitespace-pre-line text-body-sm text-muted-foreground">{post.body}</p>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 rounded text-body-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MessageCircle className="size-4" aria-hidden />
        {replyCount === 0 ? "Answer this" : `${replyCount} ${replyCount === 1 ? "answer" : "answers"}`}
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4 border-l-2 border-primary/30 pl-4">
          {post.replies.map((reply) => (
            <div key={reply.id}>
              <p className="text-caption text-muted-foreground">
                <span className="font-medium text-foreground">{reply.authorName}</span> · {timeAgo(reply.createdAt)}
              </p>
              <p className="mt-1 whitespace-pre-line text-body-sm text-foreground">{reply.body}</p>
            </div>
          ))}
          <ReplyForm postId={post.id} onReplied={onReplied} />
        </div>
      )}
    </article>
  );
}

function ReplyForm({ postId, onReplied }: { postId: string; onReplied: () => void }) {
  const author = useKnownAuthor();
  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: newReplySchema,
    initialValues: { name: author.name, email: author.email, body: "" },
    onSubmit: async (data) => {
      try {
        await createCommunityReply(postId, data);
        setChatGuest({ name: data.name, email: data.email });
        setField("body", "");
        onReplied();
      } catch {
        toast({ title: "Couldn't post your answer", description: "Please try again.", variant: "destructive" });
      }
    },
  });
  useSyncAuthor(author, values, setField);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {!author.email && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            aria-label="Your name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            variant={errors.name ? "error" : "default"}
          />
          <Input
            aria-label="Your email"
            type="email"
            placeholder="Email (not shown)"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            variant={errors.email ? "error" : "default"}
          />
        </div>
      )}
      <Textarea
        aria-label="Your answer"
        rows={3}
        placeholder="Share what worked for your pet"
        value={values.body}
        onChange={(e) => setField("body", e.target.value)}
        variant={errors.body ? "error" : "default"}
      />
      {(errors.name || errors.email || errors.body) && (
        <p className="text-caption text-destructive">{errors.name ?? errors.email ?? errors.body}</p>
      )}
      <Button type="submit" size="sm" disabled={isSubmitting} className="self-start">
        <Send className="size-3.5" aria-hidden />
        {isSubmitting ? "Posting..." : "Post answer"}
      </Button>
    </form>
  );
}

function AskForm({ defaultSpecies, onPosted }: { defaultSpecies?: CommunitySpecies; onPosted: () => void }) {
  const author = useKnownAuthor();
  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: newPostSchema,
    initialValues: {
      name: author.name,
      email: author.email,
      species: defaultSpecies ?? ("dogs" as CommunitySpecies),
      topic: "Vets" as CommunityTopic,
      title: "",
      body: "",
    },
    onSubmit: async (data) => {
      try {
        await createCommunityPost(data);
        setChatGuest({ name: data.name, email: data.email });
        setField("title", "");
        setField("body", "");
        toast({ title: "Question posted", description: "It's live on the board now." });
        onPosted();
      } catch {
        toast({ title: "Couldn't post your question", description: "Please try again in a moment.", variant: "destructive" });
      }
    },
  });
  useSyncAuthor(author, values, setField);

  return (
    <form
      onSubmit={handleSubmit}
      id="ask"
      className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-card-lg"
    >
      <div>
        <h2 className="text-heading-4 font-semibold text-foreground">Ask the community</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">No account needed. Your email is never shown.</p>
      </div>

      <FormField label="Your question" htmlFor="ask-title" error={errors.title}>
        <Input
          id="ask-title"
          placeholder="Is Dr Mehta in Andheri good with nervous cats?"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          variant={errors.title ? "error" : "default"}
        />
      </FormField>
      <FormField label="Details" htmlFor="ask-body" helperText="Optional">
        <Textarea id="ask-body" rows={3} value={values.body} onChange={(e) => setField("body", e.target.value)} />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Animal" htmlFor="ask-species">
          <Select value={values.species} onValueChange={(v) => setField("species", v as CommunitySpecies)}>
            <SelectTrigger id="ask-species" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {communitySpecies.map((s) => (
                <SelectItem key={s} value={s}>
                  {speciesConfig[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Topic" htmlFor="ask-topic">
          <Select value={values.topic} onValueChange={(v) => setField("topic", v as CommunityTopic)}>
            <SelectTrigger id="ask-topic" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {communityTopics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      {!author.email && (
        <>
          <FormField label="Name" htmlFor="ask-name" error={errors.name}>
            <Input
              id="ask-name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              variant={errors.name ? "error" : "default"}
            />
          </FormField>
          <FormField label="Email" htmlFor="ask-email" error={errors.email}>
            <Input
              id="ask-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              variant={errors.email ? "error" : "default"}
            />
          </FormField>
        </>
      )}

      <Button type="submit" variant="gradient" disabled={isSubmitting} className={cn("w-full")}>
        {isSubmitting ? "Posting..." : "Post question"}
      </Button>
    </form>
  );
}
