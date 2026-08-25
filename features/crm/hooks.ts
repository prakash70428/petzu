"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { addNote, addTag, fetchCustomerDetail, fetchCustomers, removeTag } from "./services/crm-service";
import type { CustomerDetail, CustomerSummary } from "./types";

/** Staff customer list, refetched whenever `query` changes (simple client-driven search-as-you-type). */
export function useCustomerList(query: string) {
  const { user } = useSession();
  const staffEmail = user?.email;

  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  // Starts true; only ever flipped from a .then/.catch/.finally callback,
  // never a bare effect-body call — see features/consent/hooks.ts for why.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!staffEmail) return;
    let cancelled = false;

    fetchCustomers(staffEmail, query || undefined)
      .then((result) => {
        if (!cancelled) setCustomers(result);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Couldn't load customers", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [staffEmail, query]);

  return { customers, loading };
}

/** Single customer's full CRM record: profile, tags, notes, consents, and the Interaction timeline. */
export function useCustomerDetail(customerId: string) {
  const { user } = useSession();
  const staffEmail = user?.email;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(() => {
    if (!staffEmail) return;
    return fetchCustomerDetail(staffEmail, customerId)
      .then(setCustomer)
      .catch(() => toast({ title: "Couldn't load this customer", variant: "destructive" }));
  }, [staffEmail, customerId]);

  useEffect(() => {
    if (!staffEmail) return;
    let cancelled = false;

    fetchCustomerDetail(staffEmail, customerId)
      .then((result) => {
        if (!cancelled) setCustomer(result);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Couldn't load this customer", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [staffEmail, customerId]);

  const submitNote = useCallback(
    async (body: string) => {
      if (!staffEmail || !body.trim()) return;
      setSaving(true);
      try {
        await addNote(staffEmail, customerId, body);
        await reload();
        toast({ title: "Note added", variant: "success" });
      } catch {
        toast({ title: "Couldn't add that note", variant: "destructive" });
      } finally {
        setSaving(false);
      }
    },
    [staffEmail, customerId, reload],
  );

  const submitTag = useCallback(
    async (name: string) => {
      if (!staffEmail || !name.trim()) return;
      setSaving(true);
      try {
        await addTag(staffEmail, customerId, name);
        await reload();
      } catch {
        toast({ title: "Couldn't add that tag", variant: "destructive" });
      } finally {
        setSaving(false);
      }
    },
    [staffEmail, customerId, reload],
  );

  const deleteTag = useCallback(
    async (tagId: string) => {
      if (!staffEmail) return;
      setSaving(true);
      try {
        await removeTag(staffEmail, customerId, tagId);
        await reload();
      } catch {
        toast({ title: "Couldn't remove that tag", variant: "destructive" });
      } finally {
        setSaving(false);
      }
    },
    [staffEmail, customerId, reload],
  );

  return { customer, loading, saving, submitNote, submitTag, deleteTag };
}
