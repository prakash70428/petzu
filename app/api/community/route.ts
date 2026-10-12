import { isCommunitySpecies, newPostSchema, type CommunityPostView } from "@/features/community/schema";
import { fail, ok } from "@/lib/api-response";
import { recordInteraction } from "@/lib/crm/activity";
import { getOrCreateCustomer } from "@/lib/customer";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const PAGE_SIZE = 30;

/** Latest visible questions with their visible replies, optionally for one animal. */
export async function GET(request: Request) {
  const species = new URL(request.url).searchParams.get("species");

  try {
    const posts = await prisma.communityPost.findMany({
      where: { hidden: false, ...(isCommunitySpecies(species) ? { species } : {}) },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      include: { replies: { where: { hidden: false }, orderBy: { createdAt: "asc" } } },
    });

    const view: CommunityPostView[] = posts.map((post) => ({
      id: post.id,
      authorName: post.authorName,
      species: post.species as CommunityPostView["species"],
      topic: post.topic as CommunityPostView["topic"],
      title: post.title,
      body: post.body,
      createdAt: post.createdAt.toISOString(),
      replies: post.replies.map((reply) => ({
        id: reply.id,
        authorName: reply.authorName,
        body: reply.body,
        createdAt: reply.createdAt.toISOString(),
      })),
    }));
    return ok(view);
  } catch (error) {
    console.error("Community list failed:", error);
    return fail("The community board couldn't load right now.", 503);
  }
}

/**
 * Asks a question. `website` is a honeypot (hidden from people), same as
 * app/api/enquiries: a filled one gets a 201 and nothing is stored.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  if (json && typeof json === "object" && "website" in json && json.website) {
    return ok({ received: true }, 201);
  }

  const parsed = newPostSchema.safeParse(json);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const { name, email, species, topic, title, body } = parsed.data;

  try {
    const existing = await getOrCreateCustomer(email);
    // Fill an empty name, never overwrite one: the email is unverified.
    const customer = existing.name
      ? existing
      : await prisma.customer.update({ where: { id: existing.id }, data: { name } });

    const post = await prisma.communityPost.create({
      data: { customerId: customer.id, authorName: name, species, topic, title, body: body ?? "" },
    });
    await recordInteraction(customer.id, "COMMUNITY_POST", `Asked: ${title.slice(0, 120)}`, { postId: post.id });

    return ok({ id: post.id }, 201);
  } catch (error) {
    console.error("Community post failed:", error);
    return fail("Your question couldn't be posted right now. Please try again.", 503);
  }
}
