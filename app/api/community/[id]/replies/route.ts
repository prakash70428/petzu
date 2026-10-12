import { newReplySchema } from "@/features/community/schema";
import { fail, ok } from "@/lib/api-response";
import { recordInteraction } from "@/lib/crm/activity";
import { getOrCreateCustomer } from "@/lib/customer";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const OBJECT_ID = /^[a-f\d]{24}$/i;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!OBJECT_ID.test(id)) return fail("Question not found", 404);

  const json = await request.json().catch(() => null);
  if (json && typeof json === "object" && "website" in json && json.website) {
    return ok({ received: true }, 201);
  }

  const parsed = newReplySchema.safeParse(json);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const { name, email, body } = parsed.data;

  try {
    const post = await prisma.communityPost.findFirst({ where: { id, hidden: false } });
    if (!post) return fail("Question not found", 404);

    const existing = await getOrCreateCustomer(email);
    const customer = existing.name
      ? existing
      : await prisma.customer.update({ where: { id: existing.id }, data: { name } });

    const reply = await prisma.communityReply.create({
      data: { postId: post.id, customerId: customer.id, authorName: name, body },
    });
    await recordInteraction(customer.id, "COMMUNITY_POST", `Replied to: ${post.title.slice(0, 100)}`, {
      postId: post.id,
      replyId: reply.id,
    });

    return ok({ id: reply.id }, 201);
  } catch (error) {
    console.error("Community reply failed:", error);
    return fail("Your reply couldn't be posted right now. Please try again.", 503);
  }
}
