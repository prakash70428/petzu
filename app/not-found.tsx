import { Compass, Home, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { FloatingBackground } from "@/components/motion/floating-background";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section spacing="lg" className="relative flex flex-col items-center text-center">
      <FloatingBackground intensity="subtle" />

      <div className="glass-strong flex size-20 items-center justify-center rounded-full shadow-glow">
        <Compass className="size-9 text-primary" aria-hidden />
      </div>

      <p className="mt-6 font-mono text-body-sm text-muted-foreground">404</p>
      <h1 className="mt-2 font-display text-display-lg text-foreground">This page wandered off</h1>
      <p className="mt-3 max-w-md text-body-lg text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="gradient">
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Back to home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">
            <ShoppingBag className="size-4" aria-hidden />
            Browse the shop
          </Link>
        </Button>
      </div>
    </Section>
  );
}
