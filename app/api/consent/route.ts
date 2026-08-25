import { getOrCreateCustomer } from "@/lib/customer";
import { recordInteraction } from "@/lib/crm/activity";
import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ConsentChannel, ConsentPurpose } from "@prisma/client";

export const runtime = "nodejs";

const emailSchema = z.string().email();

const updateConsentSchema = z.object({
  email: z.string().email(),
  channel: z.nativeEnum(ConsentChannel),
  purpose: z.nativeEnum(ConsentPurpose),
  granted: z.boolean(),
  /** Where this decision was captured, e.g. "dashboard-settings". */
  source: z.string().min(1),
});

/**
 * Returns every consent row for a customer. Absence of a (channel, purpose)
 * row is treated as "not granted" by the caller — this endpoint only
 * returns rows that actually exist, it never fabricates defaults.
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  const parsedEmail = emailSchema.safeParse(email);

  if (!parsedEmail.success) {
    return fail("A valid email query param is required");
  }

  const customer = await getOrCreateCustomer(parsedEmail.data);
  const consents = await prisma.consent.findMany({
    where: { customerId: customer.id },
  });

  return ok(consents);
}

/**
 * Upserts one (channel, purpose) consent decision. Every write also logs to
 * the customer's activity timeline (Phase 0's `Interaction` model) so
 * Phase 4's CRM can show staff exactly when and how a customer's consent
 * changed, not just its current state.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = updateConsentSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const { email, channel, purpose, granted, source } = parsed.data;
  const customer = await getOrCreateCustomer(email);

  const consent = await prisma.consent.upsert({
    where: { customerId_channel_purpose: { customerId: customer.id, channel, purpose } },
    create: { customerId: customer.id, channel, purpose, granted, source },
    update: { granted, source },
  });

  await recordInteraction(
    customer.id,
    "CONSENT_CHANGED",
    `${granted ? "Granted" : "Revoked"} ${channel} consent for ${purpose.toLowerCase()} messages`,
    { channel, purpose, granted, source },
  );

  return ok(consent);
}
