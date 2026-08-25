/**
 * Minimal stand-in for real RBAC. There is no `role` field anywhere in this
 * app (see AUTH.md) — `ADMIN_EMAILS` is a comma-separated allowlist checked
 * against the same client-supplied, unverified email every other route
 * trusts (see "Customer identity bridge" in PHASE-2-0-FOUNDATION.md). This
 * is a real, if thin, access gate: an unlisted email cannot write through
 * any staff-only route regardless of what the UI shows. Its limitation is
 * the same one already documented for the identity bridge — it trusts the
 * caller's claimed email — and gets fixed the same way, the day real
 * sessions replace it.
 */
export function isStaff(email: string): boolean {
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowlist.includes(email.trim().toLowerCase());
}
