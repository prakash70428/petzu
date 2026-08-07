"use client";

import { domMax, LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { durations, easings } from "@/constants/motion";

/**
 * Three jobs, all global:
 *
 * 1. `LazyMotion` + `m` components instead of the full `motion` object.
 *    Importing `motion.div` pulls Framer's entire feature set into the
 *    bundle at every call site (~110KB gzip). `m` is the same component
 *    with no features bundled, and `LazyMotion` loads exactly one feature
 *    bundle for the whole app.
 *
 *    `domMax` rather than the smaller `domAnimation` because `Tabs` uses
 *    a `layoutId` shared-layout indicator, and layout animations only
 *    exist in `domMax`. Still materially smaller than the full import.
 *
 * 2. `reducedMotion="user"` makes every Framer animation honor the OS
 *    "reduce motion" setting automatically — transform/layout animations
 *    are disabled while opacity fades still play. That distinction
 *    matters: opacity is generally safe for vestibular disorders;
 *    movement is what triggers them. Doing it here means a component
 *    can never forget to opt in.
 *
 * 3. A default `transition` so any `m` element that doesn't specify one
 *    still lands on the app's premium curve rather than Framer's generic
 *    default.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: durations.base, ease: easings.premium }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
