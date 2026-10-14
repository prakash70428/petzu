import { fail } from "@/lib/api-response";
import { staffSession } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

/**
 * GDPR Art. 20 / India DPDP-style data portability: everything the customer
 * provided or generated through using PetZu, as one structured JSON file.
 * Deliberately NOT wrapped in `lib/api-response.ts`'s `{ data }` envelope
 * like every other route in this build — this endpoint's entire purpose is
 * a file download, so it returns the raw object with a
 * `Content-Disposition: attachment` header instead.
 *
 * Excludes `Note` and `Tag`/`CustomerTag` on purpose: those are staff-authored
 * CRM context about the customer, not data the customer themselves provided
 * or generated — the same distinction Phase 4 already drew between "what
 * staff wrote about you" and "what you did."
 */
export async function GET(request: Request) {
  // Staff only: an unverified browser can't prove whose data it is asking for.
  if (!staffSession(request)) return fail("Not authorized", 403);

  const email = new URL(request.url).searchParams.get("email");
  const parsedEmail = z.string().email().safeParse(email);

  if (!parsedEmail.success) {
    return fail("A valid email query param is required");
  }

  const customer = await prisma.customer.findUnique({ where: { email: parsedEmail.data } });
  if (!customer) return fail("No customer with that email", 404);

  const [consents, interactions, chatConversations, messageLogs, feedback] = await Promise.all([
    prisma.consent.findMany({
      where: { customerId: customer.id },
      select: { channel: true, purpose: true, granted: true, source: true, updatedAt: true },
    }),
    prisma.interaction.findMany({
      where: { customerId: customer.id },
      select: { type: true, summary: true, metadata: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.chatConversation.findMany({
      where: { customerId: customer.id },
      select: {
        channel: true,
        startedAt: true,
        messages: { select: { role: true, content: true, createdAt: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    // providerId/error are our own operational diagnostics, not the
    // customer's data — included fields are limited to what was actually
    // sent to them.
    prisma.messageLog.findMany({
      where: { customerId: customer.id },
      select: { channel: true, purpose: true, templateKey: true, status: true, sentAt: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.feedback.findMany({
      where: { customerId: customer.id },
      select: { type: true, subject: true, body: true, rating: true, status: true, createdAt: true, resolvedAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    profile: {
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      customerSince: customer.createdAt,
    },
    consents,
    activityTimeline: interactions,
    chatConversations,
    messagesSentToYou: messageLogs,
    feedback,
  };

  const filename = `petzu-data-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
