"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/features/auth/store";
import { checkIsStaff } from "@/services/staff-client";

/**
 * Gates any `/dashboard/admin/**` page: resolves whether the current
 * session's email is on the `ADMIN_EMAILS` allowlist. This is a UX gate
 * only — every staff-only mutation route re-checks `isStaff()` server-side
 * regardless of what this hook returns, so a client that lies about this
 * result still can't write anything (see `lib/auth/is-staff.ts`).
 */
export function useStaffGate() {
  const { user } = useSession();
  const email = user?.email;

  // Starts true; only ever flipped from a .then/.catch/.finally callback,
  // never a bare effect-body call — see features/consent/hooks.ts for why.
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    checkIsStaff(email)
      .then((result) => {
        if (!cancelled) setIsStaff(result);
      })
      .catch(() => {
        if (!cancelled) setIsStaff(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  return { isStaff, loading };
}
