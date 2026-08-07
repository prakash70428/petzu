import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { blogIcons } from "../constants";
import type { Article } from "../types";
import { estimateReadTime, getAuthorBySlug } from "../utils";
import { AuthorByline } from "./author-byline";

const tileGradients = [
  "from-primary/25 via-primary/10 to-transparent",
  "from-info/25 via-info/10 to-transparent",
  "from-success/25 via-success/10 to-transparent",
  "from-warning/25 via-warning/10 to-transparent",
];

export interface ArticleCardProps {
  article: Article;
  index?: number;
}

/** Same full-cover-link-behind-the-controls card pattern used by ProductCard and ProviderCard. */
export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const Icon = blogIcons[article.coverIconKey];
  const author = getAuthorBySlug(article.authorSlug);
  if (!author) return null;

  return (
    <Card interactive className="group relative flex h-full flex-col overflow-hidden p-0">
      <Link href={`/blog/${article.slug}`} aria-label={article.title} className="absolute inset-0 z-10" />

      <div
        className={cn(
          "relative z-0 flex h-40 items-center justify-center bg-gradient-to-br",
          tileGradients[index % tileGradients.length],
        )}
      >
        <Badge variant="secondary" className="absolute left-3 top-3">
          {article.category}
        </Badge>
        <Icon className="size-14 text-foreground/70" strokeWidth={1.25} aria-hidden />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-card">
        <h3 className="line-clamp-2 text-body font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
          {article.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-body-sm text-muted-foreground">{article.excerpt}</p>
        <div className="border-t border-border pt-3">
          <AuthorByline
            author={author}
            publishedAt={article.publishedAt}
            readTime={estimateReadTime(article.content)}
          />
        </div>
      </div>
    </Card>
  );
}
