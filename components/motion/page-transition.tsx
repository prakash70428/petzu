"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { durations, easings } from "@/constants/motion";

/**
 * Entrance animation played on every route change.
 *
 * Deliberately restrained — 8px of lift and a short fade, no slide, no
 * scale, no crossfade between outgoing and incoming pages. A page
 * transition's job is to signal "this is new content" and mask the
 * split-second where a route swaps; anything more theatrical taxes the
 * user on *every* navigation, which is the fastest way for a "premium"
 * animation to become an irritation by the fifth click.
 *
 * There's no exit animation because Next's App Router unmounts the old
 * route before the new one mounts — an exit here would need
 * `AnimatePresence` around a route we no longer control, and the payoff
 * (a ~150ms fade-out nobody consciously registers) isn't worth blocking
 * navigation on.
 *
 * `MotionConfig reducedMotion="user"` in the providers automatically
 * strips the `y` movement for users who ask for reduced motion, leaving
 * just the opacity fade.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.slow, ease: easings.premium }}
      className="flex flex-1 flex-col"
    >
      {children}
    </m.div>
  );
}
