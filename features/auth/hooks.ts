"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "./store";

/**
 * Client-side route protection — the only kind available without a real
 * backend session to check. `useSyncExternalStore` guarantees the
 * `localStorage`-hydrated value is corrected before this effect can act on
 * stale data (see AUTH.md §8 for the real-backend equivalent of this).
 */
export function useRequireAuth() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [session.isAuthenticated, router]);

  return session;
}
