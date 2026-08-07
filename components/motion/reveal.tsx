"use client";

import { m, type HTMLMotionProps, type Variants } from "framer-motion";
import {
  defaultViewport,
  fadeInUp,
  staggerContainer,
  staggerItem,
} from "@/constants/animations";

export interface RevealProps extends HTMLMotionProps<"div"> {
  variants?: Variants;
  delay?: number;
  once?: boolean;
}

/**
 * Fades/slides content in the first time it scrolls into view. This is the
 * single scroll-reveal primitive every homepage section uses instead of
 * each section hand-rolling its own `whileInView` block.
 *
 * Typed against `HTMLMotionProps<"div">` (not plain `HTMLAttributes`) —
 * Framer Motion's own event props (`onDrag`, `onAnimationStart`, …) have
 * different signatures than the native DOM ones, so spreading generic
 * HTMLAttributes onto a `motion.div` fails to type-check.
 */
export function Reveal({
  variants = fadeInUp,
  delay = 0,
  once = true,
  ...props
}: RevealProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: defaultViewport.margin }}
      variants={variants}
      transition={{ delay }}
      {...props}
    />
  );
}

/** Wraps a list so its RevealItem children animate in with a staggered delay. */
export function RevealGroup({
  once = true,
  ...props
}: HTMLMotionProps<"div"> & { once?: boolean }) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: defaultViewport.margin }}
      variants={staggerContainer}
      {...props}
    />
  );
}

/** A single staggered child of RevealGroup — must be a direct descendant to inherit variants. */
export function RevealItem(props: HTMLMotionProps<"div">) {
  return <m.div variants={staggerItem} {...props} />;
}
