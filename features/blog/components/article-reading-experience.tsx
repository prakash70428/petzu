"use client";

import { useRef, type ReactNode } from "react";
import { ReadingProgress } from "./reading-progress";

/**
 * Owns the scroll-tracking ref and wraps already-server-rendered content
 * (including the async, shiki-highlighted `CodeBlock`s inside it) — the
 * children were rendered by a Server Component parent and passed through
 * here as opaque elements, not re-executed on the client. This is what
 * lets the reading-progress bar be interactive without turning the whole
 * article into a client bundle.
 */
export function ArticleReadingExperience({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ReadingProgress targetRef={containerRef} />
      <div ref={containerRef}>{children}</div>
    </>
  );
}
