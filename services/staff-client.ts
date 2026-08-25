import { apiClient } from "./api-client";

/**
 * Wraps `GET /api/staff` — see `lib/auth/is-staff.ts` for what this actually
 * checks and its trust limitation. Lives at the top level (not inside
 * `features/knowledge-base/`, where it started in Phase 2) because Phase 4's
 * CRM needs the exact same check — per ARCHITECTURE.md's rule, code two or
 * more features depend on belongs in a top-level folder, not one feature's.
 */
export function checkIsStaff(email: string) {
  return apiClient<{ data: { isStaff: boolean } }>(`/api/staff?email=${encodeURIComponent(email)}`).then(
    (res) => res.data.isStaff,
  );
}
