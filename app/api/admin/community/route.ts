import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { staffSession } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Every community post and reply, hidden ones included, with the author's email (staff only). */
export async function GET(request: Request) {
  if (!staffSession(request)) return fail("Not authorized", 403);

  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      customer: { select: { email: true } },
      replies: { orderBy: { createdAt: "asc" }, include: { customer: { select: { email: true } } } },
    },
  });
  return ok(posts);
}

const moderateSchema = z.object({
  kind: z.enum(["post", "reply"]),
  id: z.string().regex(/^[a-f\d]{24}$/i),
  hidden: z.boolean(),
});

/** Hide or restore a post or reply. Hidden content disappears from /community immediately. */
export async function PATCH(request: Request) {
  if (!staffSession(request)) return fail("Not authorized", 403);

  const parsed = moderateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Invalid request");

  const { kind, id, hidden } = parsed.data;
  try {
    if (kind === "post") await prisma.communityPost.update({ where: { id }, data: { hidden } });
    else await prisma.communityReply.update({ where: { id }, data: { hidden } });
    return ok({ id, hidden });
  } catch {
    return fail("Not found", 404);
  }
}
