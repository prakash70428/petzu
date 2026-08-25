import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const updateArticleSchema = z.object({
  staffEmail: z.string().email(),
  category: z.string().min(1).optional(),
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
});

const staffEmailSchema = z.object({ staffEmail: z.string().email() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateArticleSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  const { category, question, answer } = parsed.data;
  const article = await prisma.knowledgeArticle.update({ where: { id }, data: { category, question, answer } });

  return ok(article);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = staffEmailSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  await prisma.knowledgeArticle.delete({ where: { id } });

  return ok({ id });
}
