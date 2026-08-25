import { getOrCreateCustomer } from "@/lib/customer";
import { recordInteraction } from "@/lib/crm/activity";
import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { sendMessage } from "@/lib/comms/dispatcher";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { FeedbackStatus, FeedbackType } from "@prisma/client";

export const runtime = "nodejs";

const submitFeedbackSchema = z.object({
  email: z.string().email(),
  type: z.nativeEnum(FeedbackType),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
});

/**
 * Customer view (`?email=`) returns only that customer's own submissions;
 * staff view (`?staffEmail=`, optionally `&status=`) returns everything —
 * the triage queue Phase 4's admin area feeds into.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const email = params.get("email");
  const staffEmail = params.get("staffEmail");
  const status = params.get("status");

  if (staffEmail) {
    if (!isStaff(staffEmail)) {
      return fail("Not authorized", 403);
    }

    const validStatus = status && (Object.values(FeedbackStatus) as string[]).includes(status);
    const where = validStatus ? { status: status as FeedbackStatus } : undefined;

    const feedback = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { email: true, name: true } } },
    });

    return ok(feedback);
  }

  const parsedEmail = z.string().email().safeParse(email);
  if (!parsedEmail.success) {
    return fail("Either email or staffEmail query param is required");
  }

  const customer = await getOrCreateCustomer(parsedEmail.data);
  const feedback = await prisma.feedback.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });

  return ok(feedback);
}

/**
 * Submits feedback or a complaint, logs it to the customer's Interaction
 * timeline, and attempts an acknowledgement email — consent-gated like
 * every other send in this build (see PHASE-2-5-COMMS.md), so this only
 * actually sends if the customer has opted into EMAIL/SUPPORT.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = submitFeedbackSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const { email, type, subject, body: feedbackBody, rating } = parsed.data;
  const customer = await getOrCreateCustomer(email);

  const feedback = await prisma.feedback.create({
    data: { customerId: customer.id, type, subject, body: feedbackBody, rating },
  });

  await recordInteraction(
    customer.id,
    type === "COMPLAINT" ? "COMPLAINT_FILED" : "FEEDBACK_SUBMITTED",
    `${type === "COMPLAINT" ? "Complaint" : "Feedback"}: ${subject}`,
    { feedbackId: feedback.id, type, rating },
  );

  try {
    await sendMessage({
      customerId: customer.id,
      channel: "EMAIL",
      purpose: "SUPPORT",
      templateKey: "feedback-ack",
      data: { subject },
    });
  } catch (error) {
    console.error("Feedback acknowledgement dispatch failed:", error);
  }

  return ok(feedback, 201);
}
