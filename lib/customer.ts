import { prisma } from "@/lib/prisma";

/**
 * Resolves the current request's customer from a client-supplied email.
 *
 * There is no server-verified session in this app yet (see AUTH.md §9 and
 * PHASE-2-0-FOUNDATION.md "Customer identity bridge") — `email` comes
 * straight from the caller's `useSession().user.email`, unverified. This is
 * not a new weakness: today's "login" already accepts any password for any
 * email, so nothing server-side trusted that identity before either. This
 * function is the single place that assumption lives, so the day real auth
 * lands, every call site swaps `email` for a verified `session.user.email`
 * without touching the rest of the codebase.
 */
export async function getOrCreateCustomer(email: string, name?: string) {
  return prisma.customer.upsert({
    where: { email },
    create: { email, name },
    update: name ? { name } : {},
  });
}
