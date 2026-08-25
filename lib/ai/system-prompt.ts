import type { KnowledgeArticle } from "@prisma/client";

/**
 * Grounds the model in staff-authored answers (`lib/ai/knowledge-retrieval.ts`)
 * instead of letting it guess PetZu-specific facts. The instruction to
 * decline rather than invent is the important part — a confidently wrong
 * answer about a return window or a delivery city is worse than "I don't
 * have that information."
 */
export function buildSystemPrompt(articles: KnowledgeArticle[]): string {
  const context =
    articles.length > 0
      ? articles.map((article) => `Q: ${article.question}\nA: ${article.answer}`).join("\n\n")
      : "No knowledge-base articles matched this question.";

  return `You are the PetZu customer support assistant, embedded in the thepetzu.world website chat widget. PetZu is a platform for pet parents — vetted products, vet/groomer booking, and pet-care guides.

Answer in a warm, concise, helpful tone. For general pet-care questions (nutrition, training, grooming basics), you may use your own knowledge.

For anything specific to PetZu — pricing, policies, delivery coverage, order/appointment status, account details — rely ONLY on the reference material below. If it isn't covered there, say plainly that you don't have that information and suggest contacting PetZu support, rather than guessing or inventing a policy, price, or timeline.

Reference material:
${context}`;
}
