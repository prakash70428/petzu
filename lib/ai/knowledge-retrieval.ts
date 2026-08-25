import { prisma } from "@/lib/prisma";
import type { KnowledgeArticle } from "@prisma/client";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);
}

/**
 * Scores an article by how many query terms appear in its question/answer/
 * category, weighting a question match higher — a query that echoes the
 * question itself is a much stronger signal than an incidental word buried
 * in the answer body.
 */
function scoreArticle(article: KnowledgeArticle, queryTerms: string[]): number {
  const questionTerms = new Set(tokenize(article.question));
  const bodyTerms = new Set(tokenize(`${article.answer} ${article.category}`));

  return queryTerms.reduce((score, term) => {
    if (questionTerms.has(term)) return score + 2;
    if (bodyTerms.has(term)) return score + 1;
    return score;
  }, 0);
}

/**
 * Keyword search over the knowledge base. At this content scale (tens of
 * articles, not thousands) a full table scan with in-process scoring is
 * simpler and cheaper than standing up Atlas Search or a vector index — see
 * "Why keyword search, not vector search" in PHASE-2-2-KNOWLEDGE-BASE.md.
 */
export async function searchKnowledge(query: string, limit = 3): Promise<KnowledgeArticle[]> {
  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return [];

  const articles = await prisma.knowledgeArticle.findMany();

  return articles
    .map((article) => ({ article, score: scoreArticle(article, queryTerms) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => result.article);
}
