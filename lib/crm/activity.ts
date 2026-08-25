import { prisma } from "@/lib/prisma";
import type { InteractionType, Prisma } from "@prisma/client";

/**
 * Appends one row to a customer's activity timeline. Every later phase
 * (consent, chat, comms, feedback) calls this instead of inventing its own
 * log table, so Phase 4's CRM is a read-only view over data that's already
 * accumulating from day one rather than a retrofit.
 */
export async function recordInteraction(
  customerId: string,
  type: InteractionType,
  summary: string,
  metadata?: Prisma.InputJsonValue,
) {
  return prisma.interaction.create({
    data: { customerId, type, summary, metadata },
  });
}
