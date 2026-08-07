"use client";

import Link from "next/link";
import { SearchInput } from "@/components/ui/search";
import { cn } from "@/utils/cn";
import { categories } from "../constants";
import { slugify } from "../utils";

export interface BlogToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  activeCategory?: string;
}

export function BlogToolbar({ query, onQueryChange, activeCategory }: BlogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/blog"
          className={cn(
            "rounded-full px-3 py-1.5 text-body-sm font-medium transition-colors duration-150",
            !activeCategory
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          All
        </Link>
        {categories.map((category) => {
          const slug = slugify(category);
          const isActive = activeCategory === slug;
          return (
            <Link
              key={category}
              href={`/blog/category/${slug}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-body-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {category}
            </Link>
          );
        })}
      </div>

      <SearchInput
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onClear={() => onQueryChange("")}
        placeholder="Search articles…"
        aria-label="Search articles"
        className="sm:w-64"
      />
    </div>
  );
}
