"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { fetchAllFeedback, fetchMyFeedback, submitFeedback, updateFeedbackStatus } from "./services/feedback-service";
import type { FeedbackDraft, FeedbackItem, FeedbackStatus, FeedbackWithCustomer } from "./types";

/** Customer-facing: the signed-in user's own submissions, plus a submit action. */
export function useMyFeedback() {
  const { user } = useSession();
  const email = user?.email;

  const [items, setItems] = useState<FeedbackItem[]>([]);
  // Starts true; only ever flipped from a .then/.catch/.finally callback,
  // never a bare effect-body call — see features/consent/hooks.ts for why.
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const reload = useCallback(() => {
    if (!email) return Promise.resolve();
    return fetchMyFeedback(email).then(setItems);
  }, [email]);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    fetchMyFeedback(email)
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Couldn't load your feedback", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  const submit = useCallback(
    async (draft: FeedbackDraft) => {
      if (!email) return;
      setSubmitting(true);
      try {
        await submitFeedback(email, draft);
        await reload();
        toast({
          title: draft.type === "COMPLAINT" ? "Complaint submitted" : "Thanks for the feedback",
          description: "Our team will follow up if needed.",
          variant: "success",
        });
      } catch {
        toast({ title: "Couldn't submit that", variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
    },
    [email, reload],
  );

  return { items, loading, submitting, submit };
}

/** Staff-facing triage queue: everything, optionally filtered by status, with a status-change mutation. */
export function useFeedbackTriage(statusFilter?: FeedbackStatus) {
  const { user } = useSession();
  const staffEmail = user?.email;

  const [items, setItems] = useState<FeedbackWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!staffEmail) return;
    let cancelled = false;

    fetchAllFeedback(staffEmail, statusFilter)
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Couldn't load feedback", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [staffEmail, statusFilter]);

  const setStatus = useCallback(
    async (id: string, status: FeedbackStatus) => {
      if (!staffEmail) return;
      setUpdating(true);
      try {
        const updated = await updateFeedbackStatus(staffEmail, id, status);
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      } catch {
        toast({ title: "Couldn't update status", variant: "destructive" });
      } finally {
        setUpdating(false);
      }
    },
    [staffEmail],
  );

  return { items, loading, updating, setStatus };
}
