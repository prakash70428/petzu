import { getOrCreateCustomer } from "@/lib/customer";
import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/comms/dispatcher";
import { z } from "zod";

// Prisma isn't edge-compatible; every route that touches `lib/prisma.ts`
// must run on the Node.js runtime rather than the (default in some setups)
// Edge runtime.
export const runtime = "nodejs";

const upsertCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
});

/**
 * Resolves (creating if needed) the `Customer` row for the given email.
 * Called once after the client-side `useSession()` login completes, so a
 * real DB row exists before any other Phase 1+ feature needs to attach
 * data to this customer.
 *
 * First-time creation also attempts a welcome email — the one real trigger
 * point wired in Phase 5, deliberately not gated open: a brand-new customer
 * has no `Consent` row yet, so (per Phase 1's "absence means not granted"
 * rule, with no exception for TRANSACTIONAL) this send is expected to land
 * as `SKIPPED_NO_CONSENT` until they opt in from settings. That's the
 * correct behavior, not a bug — see "Why the welcome trigger usually skips"
 * in PHASE-2-5-COMMS.md.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = upsertCustomerSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const existing = await prisma.customer.findUnique({ where: { email: parsed.data.email } });
  const customer = await getOrCreateCustomer(parsed.data.email, parsed.data.name);

  if (!existing) {
    try {
      await sendMessage({
        customerId: customer.id,
        channel: "EMAIL",
        purpose: "TRANSACTIONAL",
        templateKey: "welcome",
        data: { name: customer.name ?? "there" },
      });
    } catch (error) {
      // Never let a welcome-message failure block account creation.
      console.error("Welcome message dispatch failed:", error);
    }
  }

  return ok(customer);
}

/**
 * Permanently deletes the customer's account and every record that
 * references it — every relation to `Customer` in `prisma/schema.prisma`
 * is `onDelete: Cascade` (`Interaction`, `Consent`, `ChatConversation` →
 * `ChatMessage`, `Note`, `CustomerTag`, `MessageLog`, `Feedback`), so a
 * single `prisma.customer.delete()` removes all of it in one operation —
 * confirmed directly (see PHASE-2-8-DATA-PORTABILITY.md) that nothing was
 * left orphaned afterward. Gated only by the caller's own email, the same
 * trust level as every other route built on this identity bridge (see
 * PHASE-2-0-FOUNDATION.md) — no staff check, because this is a customer
 * deleting their own account, not an admin action.
 */
export async function DELETE(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  const parsed = z.string().email().safeParse(email);

  if (!parsed.success) {
    return fail("A valid email query param is required");
  }

  const customer = await prisma.customer.findUnique({ where: { email: parsed.data } });
  if (!customer) {
    return ok({ deleted: false });
  }

  await prisma.customer.delete({ where: { id: customer.id } });
  return ok({ deleted: true });
}
