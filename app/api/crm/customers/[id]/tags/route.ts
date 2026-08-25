import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const addTagSchema = z.object({
  staffEmail: z.string().email(),
  name: z.string().min(1).max(40),
});

const removeTagSchema = z.object({
  staffEmail: z.string().email(),
  tagId: z.string().min(1),
});

/** Attaches a tag, creating it in the shared `Tag` pool if it doesn't exist yet. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = addTagSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  const name = parsed.data.name.trim();
  const tag = await prisma.tag.upsert({ where: { name }, create: { name }, update: {} });

  await prisma.customerTag.upsert({
    where: { customerId_tagId: { customerId: id, tagId: tag.id } },
    create: { customerId: id, tagId: tag.id },
    update: {},
  });

  return ok({ id: tag.id, name: tag.name }, 201);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = removeTagSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  await prisma.customerTag.deleteMany({ where: { customerId: id, tagId: parsed.data.tagId } });

  return ok({ tagId: parsed.data.tagId });
}
