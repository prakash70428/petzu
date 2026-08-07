import { describe, expect, it } from "vitest";
import { articles, authors } from "./constants";
import {
  estimateReadTime,
  filterArticles,
  getArticleBySlug,
  getHeadings,
  getRelatedArticles,
  slugify,
} from "./utils";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Vet Care")).toBe("vet-care");
  });

  it("strips punctuation and collapses separators", () => {
    expect(slugify("5 signs your dog needs a vet — visit!")).toBe(
      "5-signs-your-dog-needs-a-vet-visit",
    );
  });

  it("never leaves a leading or trailing hyphen", () => {
    expect(slugify("  ...Hello...  ")).toBe("hello");
  });

  it("is idempotent", () => {
    const once = slugify("Dental & Oral Surgery");
    expect(slugify(once)).toBe(once);
  });
});

describe("getHeadings", () => {
  it("extracts headings with ids matching the rendered anchors", () => {
    // The TOC and the rendered <h2 id> must agree — both derive from
    // slugify(), and this is the test that keeps them in sync.
    const article = getArticleBySlug("5-signs-your-dog-needs-a-vet-visit")!;
    const headings = getHeadings(article.content);

    expect(headings.length).toBeGreaterThan(0);
    for (const heading of headings) {
      expect(heading.id).toBe(slugify(heading.text));
    }
  });

  it("ignores non-heading blocks", () => {
    const headings = getHeadings([
      { type: "paragraph", text: "not a heading" },
      { type: "heading", level: 2, text: "A heading" },
    ]);
    expect(headings).toHaveLength(1);
    expect(headings[0].text).toBe("A heading");
  });
});

describe("estimateReadTime", () => {
  it("always returns at least one minute", () => {
    expect(estimateReadTime([{ type: "paragraph", text: "short" }])).toBe("1 min read");
  });

  it("scales with content length", () => {
    const long = Array.from({ length: 40 }, () => ({
      type: "paragraph" as const,
      text: "word ".repeat(100),
    }));
    const minutes = Number.parseInt(estimateReadTime(long), 10);
    expect(minutes).toBeGreaterThan(5);
  });

  it("produces a plausible time for every real article", () => {
    for (const article of articles) {
      const minutes = Number.parseInt(estimateReadTime(article.content), 10);
      expect(minutes).toBeGreaterThan(0);
      expect(minutes).toBeLessThan(60);
    }
  });
});

describe("filterArticles", () => {
  it("returns everything for an empty query", () => {
    expect(filterArticles(articles, "")).toHaveLength(articles.length);
    expect(filterArticles(articles, "   ")).toHaveLength(articles.length);
  });

  it("matches title, category and tags case-insensitively", () => {
    expect(filterArticles(articles, "NUTRITION").length).toBeGreaterThan(0);
    expect(filterArticles(articles, "zzzznotathing")).toHaveLength(0);
  });
});

describe("getRelatedArticles", () => {
  it("excludes the source article and respects the limit", () => {
    const article = articles[0];
    const related = getRelatedArticles(article, 3);
    expect(related).toHaveLength(3);
    expect(related.some((a) => a.id === article.id)).toBe(false);
  });

  it("prefers same-category articles first", () => {
    const article = getArticleBySlug("5-signs-your-dog-needs-a-vet-visit")!;
    const sameCategoryCount = articles.filter(
      (a) => a.id !== article.id && a.category === article.category,
    ).length;
    if (sameCategoryCount > 0) {
      expect(getRelatedArticles(article)[0].category).toBe(article.category);
    }
  });
});

describe("blog data integrity", () => {
  it("has unique article slugs and author slugs", () => {
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    expect(new Set(authors.map((a) => a.slug)).size).toBe(authors.length);
  });

  it("points every article at an author that exists", () => {
    const slugs = new Set(authors.map((a) => a.slug));
    for (const article of articles) {
      expect(slugs.has(article.authorSlug)).toBe(true);
    }
  });

  it("produces unique heading ids within each article", () => {
    for (const article of articles) {
      const ids = getHeadings(article.content).map((h) => h.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
