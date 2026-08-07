import { articles, authors, categories } from "./constants";
import type { Article, ContentBlock, TocHeading } from "./types";

const WORDS_PER_MINUTE = 200;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getAuthorBySlug(slug: string) {
  return authors.find((author) => author.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((article) => article.category.toLowerCase() === category.toLowerCase());
}

export function getCategoryBySlug(slug: string): string | undefined {
  return categories.find((category) => slugify(category) === slug);
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return articles.filter((article) => article.authorSlug === authorSlug);
}

export function filterArticles(items: Article[], query: string): Article[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((article) =>
    `${article.title} ${article.excerpt} ${article.category} ${article.tags.join(" ")}`
      .toLowerCase()
      .includes(normalized),
  );
}

/** Same category first, then anything else, excluding the article itself. */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const sameCategory = articles.filter((a) => a.id !== article.id && a.category === article.category);
  const rest = articles.filter((a) => a.id !== article.id && a.category !== article.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function estimateReadTime(content: ContentBlock[]): string {
  const wordCount = content.reduce((sum, block) => {
    if (block.type === "paragraph" || block.type === "quote") return sum + block.text.split(/\s+/).length;
    if (block.type === "heading") return sum + block.text.split(/\s+/).length;
    if (block.type === "list") return sum + block.items.join(" ").split(/\s+/).length;
    if (block.type === "code") return sum + block.code.split(/\s+/).length * 0.3; // code reads slower per "word" but skims faster overall
    return sum;
  }, 0);
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export function getHeadings(content: ContentBlock[]): TocHeading[] {
  return content
    .filter((block): block is Extract<ContentBlock, { type: "heading" }> => block.type === "heading")
    .map((block) => ({ id: slugify(block.text), text: block.text, level: block.level }));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
