import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { searchKnowledge } from "@/lib/ai/knowledge-retrieval";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const createArticleSchema = z.object({
  staffEmail: z.string().email(),
  category: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

/**
 * Public read endpoint — knowledge-base content isn't sensitive, and both
 * Phase 3's chatbot and any future public help-center UI need to read it
 * without a staff email. `?q=` runs the keyword search from
 * `lib/ai/knowledge-retrieval.ts`; omitting it returns everything, grouped
 * implicitly by `category` (the admin UI groups client-side).
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q");

  if (query) {
    const results = await searchKnowledge(query);
    return ok(results);
  }

  const articles = await prisma.knowledgeArticle.findMany({ orderBy: { category: "asc" } });
  return ok(articles);
}

/**
 * Staff-only write. `staffEmail` is checked against `isStaff()` — see that
 * function's doc comment for the trust limitation this inherits from the
 * broader identity bridge.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createArticleSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  const { category, question, answer } = parsed.data;
  const article = await prisma.knowledgeArticle.create({ data: { category, question, answer } });

  return ok(article, 201);
}
