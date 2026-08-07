import type { Variants } from "framer-motion";
import { durations, easings } from "./motion";

/**
 * Shared Framer Motion variants for scroll-reveal and entrance animation.
 *
 * These deliberately draw their timing from `constants/motion.ts` rather
 * than declaring their own — before the polish pass these used generic
 * `ease: "easeOut"` strings while dialogs/toasts/tabs used the premium
 * cubic-béziers, which meant the site had two competing motion
 * vocabularies: content entrances felt mechanical while chrome felt
 * refined. One source of easing is what makes the whole app feel like a
 * single product rather than assembled parts.
 */

/** Distance content travels on entrance. Small on purpose — see POLISH.md §1. */
const TRAVEL = 20;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.slow, ease: easings.premium },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: TRAVEL },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slower, ease: easings.premium },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -TRAVEL },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slower, ease: easings.premium },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.slow, ease: easings.premium },
  },
};

/** Wrap a list's parent with this to stagger its children's entrances. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = fadeInUp;

/**
 * Reveal slightly before the element is fully on screen, so content has
 * finished animating by the time it's centred in the reader's view —
 * revealing exactly at the viewport edge makes the motion itself the
 * thing you notice, which is backwards.
 */
export const defaultViewport = { once: true, margin: "-96px" } as const;
