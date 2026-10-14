"use client";

import { useCallback, useState } from "react";
import { useSession } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { requestMyData, type DataRequestKind } from "./services/account-service";

/** Drives the settings page's "request my data" and "request deletion" actions. */
export function useAccountActions() {
  const { user } = useSession();
  const [pending, setPending] = useState<DataRequestKind | null>(null);

  const request = useCallback(
    async (kind: DataRequestKind) => {
      if (!user?.email) return false;
      setPending(kind);
      try {
        await requestMyData(kind, user.name || user.email, user.email);
        toast({
          title: kind === "export" ? "Request sent" : "Deletion requested",
          description: `We'll email ${user.email} to confirm it's you, then ${kind === "export" ? "send your data" : "delete your account"} within 30 days.`,
          variant: "success",
        });
        return true;
      } catch {
        toast({ title: "Couldn't send your request", description: "Please try again.", variant: "destructive" });
        return false;
      } finally {
        setPending(null);
      }
    },
    [user],
  );

  return { pending, request };
}
