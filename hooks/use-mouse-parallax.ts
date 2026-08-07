"use client";

import { useMotionValue } from "framer-motion";
import { useCallback, type PointerEvent } from "react";

/**
 * Tracks pointer position within a container as two normalized motion
 * values (-0.5..0.5 on each axis, 0 = center). Consumers derive their own
 * parallax depth per layer via `useTransform(x, v => v * depth)` — kept
 * here as raw values (not pre-multiplied) so every layer can move at its
 * own speed without re-subscribing to a new hook instance per layer.
 */
export function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left) / rect.width - 0.5);
      y.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [x, y],
  );

  const onPointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { x, y, onPointerMove, onPointerLeave };
}
