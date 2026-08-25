"use client";

import { useCallback, useState } from "react";
import { useSession } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { deleteMyAccount, exportMyData } from "./services/account-service";

/** Drives the settings page's "Export my data" and "Delete account" actions. */
export function useAccountActions() {
  const { user } = useSession();
  const email = user?.email;

  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const exportData = useCallback(async () => {
    if (!email) return;
    setExporting(true);
    try {
      await exportMyData(email);
    } catch {
      toast({ title: "Couldn't export your data", description: "Please try again.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }, [email]);

  const deleteAccount = useCallback(async () => {
    if (!email) return false;
    setDeleting(true);
    try {
      await deleteMyAccount(email);
      return true;
    } catch {
      toast({ title: "Couldn't delete your account", description: "Please try again.", variant: "destructive" });
      return false;
    } finally {
      setDeleting(false);
    }
  }, [email]);

  return { exporting, exportData, deleting, deleteAccount };
}
