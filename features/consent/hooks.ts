"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { consentChannels, consentPurposes } from "./constants";
import { fetchConsents, updateConsent } from "./services/consent-service";
import type { ConsentChannel, ConsentPurpose, ConsentRecord } from "./types";

function cellKey(channel: ConsentChannel, purpose: ConsentPurpose) {
  return `${channel}:${purpose}`;
}

/**
 * Loads and mutates the current session's consent grid. Absence of a record
 * for a (channel, purpose) pair means "not granted" — this hook never
 * defaults a cell to true on its own, only an explicit toggle (which
 * persists immediately) turns one on.
 */
export function useConsent() {
  const { user } = useSession();
  const email = user?.email;

  const [grid, setGrid] = useState<Map<string, boolean>>(new Map());
  // Starts true, not toggled on synchronously — the dashboard shell already
  // redirects unauthenticated visitors away (see useRequireAuth), so `email`
  // resolves quickly; this only ever flips to false from the fetch's
  // .then/.catch/.finally below, never from a bare effect-body call.
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    fetchConsents(email)
      .then((records: ConsentRecord[]) => {
        if (cancelled) return;
        setGrid(new Map(records.filter((r) => r.granted).map((r) => [cellKey(r.channel, r.purpose), true])));
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Couldn't load your preferences", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  const isGranted = useCallback((channel: ConsentChannel, purpose: ConsentPurpose) => grid.get(cellKey(channel, purpose)) ?? false, [grid]);

  const isPending = useCallback((channel: ConsentChannel, purpose: ConsentPurpose) => pending.has(cellKey(channel, purpose)), [pending]);

  const toggle = useCallback(
    async (channel: ConsentChannel, purpose: ConsentPurpose, granted: boolean) => {
      if (!email) return;
      const key = cellKey(channel, purpose);

      setPending((prev) => new Set(prev).add(key));
      setGrid((prev) => new Map(prev).set(key, granted));

      try {
        await updateConsent(email, channel, purpose, granted);
      } catch {
        setGrid((prev) => new Map(prev).set(key, !granted));
        toast({ title: "Couldn't save that change", description: "Please try again.", variant: "destructive" });
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [email],
  );

  return { channels: consentChannels, purposes: consentPurposes, isGranted, isPending, toggle, loading };
}
