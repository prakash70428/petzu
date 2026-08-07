import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (e.g. "main", "section"). */
  as?: ElementType;
}

/** Centers content and applies the responsive `.container` gutter/max-width system. */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("container", className)} {...props} />;
}
