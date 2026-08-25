"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { createArticle, deleteArticle, fetchArticles, updateArticle } from "./services/knowledge-service";
import type { KnowledgeArticle, KnowledgeArticleDraft } from "./types";

/**
 * Drives the knowledge-base admin page's article list and CRUD mutations.
 * Staff access itself is gated one layer up, by `app/dashboard/admin/layout.tsx`
 * (via `useStaffGate()`) — every mutation this hook triggers is still
 * re-checked server-side regardless (see `lib/auth/is-staff.ts`).
 */
export function useKnowledgeAdmin() {
  const { user } = useSession();
  const email = user?.email;

  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  // Starts true; only ever flipped from the .then/.catch/.finally callbacks
  // below, never from a bare effect-body call (see the Phase 1 note in
  // features/consent/hooks.ts for why).
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    fetchArticles()
      .then((articleList) => {
        if (!cancelled) setArticles(articleList);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Couldn't load the knowledge base", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  const create = useCallback(
    async (draft: KnowledgeArticleDraft) => {
      if (!email) return;
      setSaving(true);
      try {
        const article = await createArticle(email, draft);
        setArticles((prev) => [...prev, article]);
        toast({ title: "Article added", variant: "success" });
      } catch {
        toast({ title: "Couldn't add that article", variant: "destructive" });
      } finally {
        setSaving(false);
      }
    },
    [email],
  );

  const update = useCallback(
    async (id: string, draft: KnowledgeArticleDraft) => {
      if (!email) return;
      setSaving(true);
      try {
        const article = await updateArticle(email, id, draft);
        setArticles((prev) => prev.map((a) => (a.id === id ? article : a)));
        toast({ title: "Article updated", variant: "success" });
      } catch {
        toast({ title: "Couldn't save that change", variant: "destructive" });
      } finally {
        setSaving(false);
      }
    },
    [email],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!email) return;
      setSaving(true);
      try {
        await deleteArticle(email, id);
        setArticles((prev) => prev.filter((a) => a.id !== id));
        toast({ title: "Article removed", variant: "default" });
      } catch {
        toast({ title: "Couldn't remove that article", variant: "destructive" });
      } finally {
        setSaving(false);
      }
    },
    [email],
  );

  return { articles, loading, saving, create, update, remove };
}
