import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { FeedbackStatus } from "@prisma/client";

export const runtime = "nodejs";

const updateStatusSchema = z.object({
  staffEmail: z.string().email(),
  status: z.nativeEnum(FeedbackStatus),
});

/** Staff-only status transition. Setting RESOLVED or CLOSED stamps `resolvedAt`; moving back out of either clears it. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  const { status } = parsed.data;
  const isTerminal = status === "RESOLVED" || status === "CLOSED";

  const feedback = await prisma.feedback.update({
    where: { id },
    data: { status, resolvedAt: isTerminal ? new Date() : null },
  });

  return ok(feedback);
}
