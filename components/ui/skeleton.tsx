import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Base placeholder block. Uses a directional light sweep rather than
 * `animate-pulse` — see the `--animate-shimmer` note in styles/animations.css
 * for why. Compose these into layout-shaped skeletons rather than
 * showing a spinner: a skeleton that matches the shape of what's coming
 * prevents the content jump that makes loading feel slower than it is.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-md bg-muted",
        "bg-[linear-gradient(90deg,var(--color-muted)_25%,color-mix(in_oklch,var(--color-muted)_60%,var(--color-background))_50%,var(--color-muted)_75%)] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
