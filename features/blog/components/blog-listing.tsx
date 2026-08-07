"use client";

import { useMemo, useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import type { Article } from "../types";
import { filterArticles } from "../utils";
import { ArticleGrid } from "./article-grid";
import { BlogToolbar } from "./blog-toolbar";

const PAGE_SIZE = 4;

export interface BlogListingProps {
  articles: Article[];
  activeCategory?: string;
  initialQuery?: string;
}

/** Shared by the main listing, category pages, and search — search/pagination state stays client-only, same rationale as ShopListing in STORE.md. */
export function BlogListing({ articles, activeCategory, initialQuery = "" }: BlogListingProps) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterArticles(articles, query), [articles, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleQueryChange(next: string) {
    setQuery(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-8">
      <BlogToolbar query={query} onQueryChange={handleQueryChange} activeCategory={activeCategory} />
      <ArticleGrid articles={visible} emptyMessage="No articles match your search." />
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="self-center"
        />
      )}
    </div>
  );
}
