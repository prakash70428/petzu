"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface MarqueeProps {
  children: ReactNode;
  durationSeconds?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Infinite horizontal scroller. Renders `children` twice back-to-back and
 * animates the pair by exactly -50%, so the loop point is invisible. Falls
 * back to a static row for reduced-motion users instead of an infinite
 * animation they didn't ask for.
 */
export function Marquee({ children, durationSeconds = 28, reverse = false, className }: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <m.div
        className="flex shrink-0 items-center gap-16 pr-16"
        animate={
          prefersReducedMotion
            ? undefined
            : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
        }
        transition={{ duration: durationSeconds, ease: "linear", repeat: Infinity }}
      >
        {children}
        {children}
      </m.div>
    </div>
  );
}
