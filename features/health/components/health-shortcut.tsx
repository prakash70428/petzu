"use client";

import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/utils/cn";

/**
 * Client point 13: health records need "a button in the nav bar, and when
 * you scroll down in the site it should also be an option". The navbar has
 * the link; this pill appears bottom-left once the navbar has scrolled
 * away, opposite the chat button.
 */
export function HealthShortcut() {
  const scrolled = useScrollPosition(400);
  const pathname = usePathname();
  if (pathname.startsWith("/health") || pathname.startsWith("/dashboard")) return null;

  return (
    <Link
      href="/health"
      aria-hidden={!scrolled}
      tabIndex={scrolled ? undefined : -1}
      className={cn(
        "fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-3 text-body-sm font-medium text-foreground shadow-lg backdrop-blur-md transition-all duration-300 ease-premium hover:border-primary/50 hover:text-primary",
        scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <HeartPulse className="size-4 text-primary" aria-hidden />
      Health records
    </Link>
  );
}
