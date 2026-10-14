"use client";

import { Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/dashboard/components";
import { formatRelativeTime } from "@/features/dashboard/utils";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/services/api-client";

interface Reply {
  id: string;
  authorName: string;
  body: string;
  hidden: boolean;
  createdAt: string;
  customer: { email: string };
}

interface Post extends Omit<Reply, "body"> {
  species: string;
  topic: string;
  title: string;
  body: string;
  replies: Reply[];
}

/** Every question and answer, with a one-click hide/restore. Emails are shown here only, never on the public board. */
export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  const load = useCallback(() => {
    apiClient<{ data: Post[] }>("/api/admin/community")
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  useEffect(load, [load]);

  async function setHidden(kind: "post" | "reply", id: string, hidden: boolean) {
    try {
      await apiClient("/api/admin/community", { method: "PATCH", body: JSON.stringify({ kind, id, hidden }) });
      toast({ title: hidden ? "Hidden from the community" : "Visible again", variant: "success" });
      load();
    } catch {
      toast({ title: "Couldn't update", variant: "destructive" });
    }
  }

  return (
    <>
      <PageHeader title="Community" description="Hide anything off-topic or abusive; it disappears from /community at once." />
      {posts === null ? (
        <p className="text-body-sm text-muted-foreground">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">No questions yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id} className={`rounded-2xl border border-border p-card ${post.hidden ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                    <Badge variant="secondary">{post.species}</Badge>
                    <Badge variant="outline">{post.topic}</Badge>
                    {post.hidden && <Badge variant="destructive">Hidden</Badge>}
                    <span>
                      {post.authorName} ({post.customer.email}) · {formatRelativeTime(post.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-foreground">{post.title}</p>
                  {post.body && <p className="mt-1 whitespace-pre-line text-body-sm text-muted-foreground">{post.body}</p>}
                </div>
                <Button size="sm" variant="outline" onClick={() => setHidden("post", post.id, !post.hidden)}>
                  {post.hidden ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
                  {post.hidden ? "Show" : "Hide"}
                </Button>
              </div>
              {post.replies.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2 border-l-2 border-border pl-4">
                  {post.replies.map((reply) => (
                    <li key={reply.id} className={`flex items-start justify-between gap-3 ${reply.hidden ? "opacity-60" : ""}`}>
                      <p className="text-body-sm text-foreground">
                        <span className="text-caption text-muted-foreground">
                          {reply.authorName} ({reply.customer.email}){reply.hidden ? " · hidden" : ""}:{" "}
                        </span>
                        {reply.body}
                      </p>
                      <Button size="sm" variant="ghost" onClick={() => setHidden("reply", reply.id, !reply.hidden)}>
                        {reply.hidden ? "Show" : "Hide"}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
