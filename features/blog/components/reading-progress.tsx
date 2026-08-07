"use client";

import { m, useScroll, useSpring } from "framer-motion";
import type { RefObject } from "react";

/**
 * Tracks scroll progress through *the article container specifically*
 * (via `target`), not the whole page — so the bar reaches 100% when
 * you've read the article, not when you've scrolled past the footer too.
 */
export function ReadingProgress({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-brand"
      style={{ scaleX }}
    />
  );
}
