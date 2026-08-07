import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Container } from "./container";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      sm: "py-section-sm",
      default: "py-section",
      lg: "py-section-lg",
      none: "py-0",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /** Wrap content in the responsive `.container`. Defaults to true. */
  contained?: boolean;
}

/** Standard page-section wrapper: consistent vertical rhythm + optional container. */
export function Section({
  className,
  spacing,
  contained = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionVariants({ spacing }), className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
