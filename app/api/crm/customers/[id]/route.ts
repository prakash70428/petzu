import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * The CRM detail view's single data source: profile, tags, notes, consent
 * state, and the `Interaction` timeline that's been accumulating since
 * Phase 1 — this route is almost entirely a read, which is the payoff
 * described back in PHASE-2-0-FOUNDATION.md for modeling `Interaction`
 * generically from the start instead of retrofitting it here.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staffEmail = new URL(request.url).searchParams.get("staffEmail") ?? "";

  if (!isStaff(staffEmail)) {
    return fail("Not authorized", 403);
  }

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      customerTags: { include: { tag: true } },
      notes: { orderBy: { createdAt: "desc" } },
      interactions: { orderBy: { createdAt: "desc" }, take: 200 },
      consents: true,
    },
  });

  if (!customer) {
    return fail("Customer not found", 404);
  }

  return ok({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    createdAt: customer.createdAt,
    tags: customer.customerTags.map((customerTag) => ({ id: customerTag.tag.id, name: customerTag.tag.name })),
    notes: customer.notes,
    interactions: customer.interactions,
    consents: customer.consents,
  });
}
