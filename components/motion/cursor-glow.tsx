"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import type { ElementType, HTMLAttributes, PointerEvent } from "react";
import { cn } from "@/utils/cn";

export interface CursorGlowProps extends HTMLAttributes<HTMLDivElement> {
  /** Diameter of the glow, as a Tailwind arbitrary-value-friendly size. */
  size?: number;
  as?: ElementType;
}

/**
 * A soft, brand-tinted light that follows the cursor within its container.
 * Scoped to one section (the hero) rather than replacing the OS cursor
 * globally — a full custom-cursor takeover reads as a gimmick and breaks
 * native cursor affordances; a scoped ambient glow reads as premium
 * atmosphere, closer to how Linear/Stripe use spotlight effects.
 */
export function CursorGlow({ as: Tag = "div", size = 360, className, children, ...props }: CursorGlowProps) {
  const left = useMotionValue(-9999);
  const top = useMotionValue(-9999);
  const springLeft = useSpring(left, { stiffness: 150, damping: 22 });
  const springTop = useSpring(top, { stiffness: 150, damping: 22 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    left.set(event.clientX - rect.left);
    top.set(event.clientY - rect.top);
  }

  function handlePointerLeave() {
    left.set(-9999);
    top.set(-9999);
  }

  return (
    <Tag
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("relative", className)}
      {...props}
    >
      <m.div
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 via-warning/10 to-transparent blur-2xl"
        style={{ left: springLeft, top: springTop, width: size, height: size }}
      />
      {children}
    </Tag>
  );
}
