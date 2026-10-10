import { enquiryBody, enquirySchema, enquirySubject } from "@/features/enquiries/schema";
import { fail, ok } from "@/lib/api-response";
import { sendMessage } from "@/lib/comms/dispatcher";
import { recordInteraction } from "@/lib/crm/activity";
import { getOrCreateCustomer } from "@/lib/customer";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Contact-page and /partners submissions. Stored as Feedback rows
 * (type ENQUIRY or PARTNERSHIP) so they land in the existing staff triage
 * queue at /dashboard/admin/feedback instead of a new inbox nobody watches.
 *
 * `website` is a honeypot: the field is hidden from people, so anything in
 * it came from a bot. We answer 201 so the bot learns nothing, and store
 * nothing.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  if (json && typeof json === "object" && "website" in json && json.website) {
    return ok({ received: true }, 201);
  }

  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const enquiry = parsed.data;
  const existing = await getOrCreateCustomer(enquiry.email);
  // Fill an empty name, never overwrite one: the email is unverified.
  const customer = existing.name
    ? existing
    : await prisma.customer.update({ where: { id: existing.id }, data: { name: enquiry.name } });

  const subject = enquirySubject(enquiry);
  const feedback = await prisma.feedback.create({
    data: {
      customerId: customer.id,
      type: enquiry.kind === "PARTNERSHIP" ? "PARTNERSHIP" : "ENQUIRY",
      subject,
      body: enquiryBody(enquiry),
    },
  });

  await recordInteraction(customer.id, "FEEDBACK_SUBMITTED", subject, { feedbackId: feedback.id, kind: enquiry.kind });

  try {
    await sendMessage({
      customerId: customer.id,
      channel: "EMAIL",
      purpose: "SUPPORT",
      templateKey: "feedback-ack",
      data: { subject },
    });
  } catch (error) {
    console.error("Enquiry acknowledgement dispatch failed:", error);
  }

  return ok({ received: true }, 201);
}
