"use client";

import { m } from "framer-motion";
import { PawPrint } from "lucide-react";
import { easings } from "@/constants/motion";

export interface BrandLoaderProps {
  label?: string;
}

/**
 * Three concentric rings orbiting a paw mark, each offset in phase so the
 * composition reads as one continuous system rather than three separate
 * spinners.
 *
 * The choice being made here: a *branded* loader instead of a generic
 * spinner. A loading state is often the very first thing a visitor sees
 * on a slow connection, and a default spinner says "generic software"
 * while a considered one says "someone owns this product." It's also
 * deliberately calm — a frantic spinner makes waiting feel longer, which
 * is the opposite of what a loading state is for.
 *
 * Framer rather than CSS keyframes so `MotionConfig reducedMotion="user"`
 * neutralises the movement automatically for users who ask for that.
 */
export function BrandLoader({ label = "Loading" }: BrandLoaderProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-5">
      <div className="relative flex size-20 items-center justify-center">
        {[0, 1, 2].map((ring) => (
          <m.span
            key={ring}
            aria-hidden
            className="absolute rounded-full border border-primary/30"
            style={{ inset: ring * 8 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.7, 0.25] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: easings.smooth,
              delay: ring * 0.25,
            }}
          />
        ))}
        <m.span
          aria-hidden
          className="glass-strong relative flex size-11 items-center justify-center rounded-full shadow-glow"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: easings.smooth }}
        >
          <PawPrint className="size-5 text-primary" />
        </m.span>
      </div>
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <span className="sr-only">Content is loading, please wait.</span>
    </div>
  );
}
