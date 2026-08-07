import type { Article } from "../types";
import { ArticleGrid } from "./article-grid";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div>
      <h2 className="text-heading-3 font-semibold text-foreground">More to read</h2>
      <div className="mt-6">
        <ArticleGrid articles={articles} />
      </div>
    </div>
  );
}
