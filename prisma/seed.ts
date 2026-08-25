/**
 * Seeds the knowledge base from the existing static FAQ content
 * (`features/blog/constants.ts`), which stays exactly as-is and keeps
 * powering the public `/faq` page — this only *copies* that content into a
 * separate, staff-editable source Phase 3's chatbot reads from. See "Why
 * seed from /faq instead of migrating it" in PHASE-2-2-KNOWLEDGE-BASE.md.
 *
 * Safe to re-run: skips any (category, question) pair that already exists
 * instead of duplicating it.
 */
import { PrismaClient } from "@prisma/client";
import { faqCategories } from "../features/blog/constants";

const prisma = new PrismaClient();

async function main() {
  let created = 0;
  let skipped = 0;

  for (const category of faqCategories) {
    for (const item of category.items) {
      const existing = await prisma.knowledgeArticle.findFirst({
        where: { category: category.title, question: item.question },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.knowledgeArticle.create({
        data: { category: category.title, question: item.question, answer: item.answer },
      });
      created++;
    }
  }

  console.log(`Knowledge base seed: ${created} created, ${skipped} already present.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
