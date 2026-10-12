"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession, useSessionHydrated } from "./store";

/**
 * Client-side route protection — the only kind available without a real
 * backend session to check (see AUTH.md §8 for the real-backend
 * equivalent). It waits for the saved session to be read: the hydration
 * render always sees the signed-out server snapshot, and redirecting on
 * that bounced signed-in people to /sign-in on every dashboard refresh.
 */
export function useRequireAuth() {
  const session = useSession();
  const hydrated = useSessionHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !session.isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [hydrated, session.isAuthenticated, router]);

  return session;
}
