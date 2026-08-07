"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import type { TocHeading } from "../types";

export interface TableOfContentsProps {
  headings: TocHeading[];
  hideLabel?: boolean;
}

/** Scroll-spy via IntersectionObserver — the active link tracks whichever heading is currently crossing the "reading line" near the top of the viewport. */
export function TableOfContents({ headings, hideLabel = false }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-1">
      {!hideLabel && (
        <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
      )}
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            "border-l-2 py-1 text-body-sm transition-colors duration-150",
            heading.level === 3 ? "pl-7" : "pl-4",
            activeId === heading.id
              ? "border-primary font-medium text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
