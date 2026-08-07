import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/page-transition";

/**
 * `template.tsx`, not `layout.tsx` — a layout persists across navigations
 * (which is exactly why the navbar lives there), while a template
 * remounts on every route change. That remount is what re-fires the
 * entrance animation; putting this in the layout would animate once on
 * first load and never again.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
