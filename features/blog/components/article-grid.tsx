import { Newspaper } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { Article } from "../types";
import { ArticleCard } from "./article-card";

export interface ArticleGridProps {
  articles: Article[];
  emptyMessage?: string;
}

export function ArticleGrid({ articles, emptyMessage = "No articles found." }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <Newspaper className="size-10 text-muted-foreground" aria-hidden />
        <p className="text-body-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <RevealItem key={article.id}>
          <ArticleCard article={article} index={index} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
