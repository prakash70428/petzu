/**
 * Motion tokens for Framer Motion. Mirrors the CSS `--ease-*` /
 * elevation tokens in styles/theme.css so JS-driven animation (which CSS
 * transitions can't express — exit animations, layout animations, spring
 * physics) still feels like the same motion language as CSS transitions.
 */
export const durations = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

/** Cubic-bezier control points matching styles/theme.css --ease-* tokens. */
export const easings = {
  premium: [0.16, 1, 0.3, 1],
  snappy: [0.4, 0, 0.2, 1],
  smooth: [0.65, 0, 0.35, 1],
  bounce: [0.34, 1.56, 0.64, 1],
} as const;

/** Overlay/backdrop fade for dialogs and drawers. */
export const overlayTransition = {
  duration: durations.fast,
  ease: easings.snappy,
};

/** Dialog/sheet content enter-exit — deceleration curve reads as "premium". */
export const dialogTransition = {
  duration: durations.base,
  ease: easings.premium,
};

/** Toast enter/exit — spring feels more alive than an eased tween for transient UI. */
export const toastTransition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
} as const;

/** Accordion panel expand/collapse. */
export const accordionTransition = {
  duration: durations.base,
  ease: easings.smooth,
};

/** Tabs' sliding active-indicator underline/pill. */
export const tabIndicatorTransition = {
  type: "spring",
  stiffness: 500,
  damping: 40,
} as const;
