import { ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";

export const runtime = "nodejs";

/**
 * Lets a client decide whether to show staff-only UI (the knowledge-base
 * admin page here, Phase 4's CRM pages later) without leaking `ADMIN_EMAILS`
 * itself. This is a UX convenience, not the actual security boundary — every
 * staff-only write route re-checks `isStaff()` independently, so a client
 * that lies about this response still can't mutate anything.
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email") ?? "";
  return ok({ isStaff: isStaff(email) });
}
