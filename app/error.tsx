"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Without this, any thrown render error shows
 * Next's default error screen — fine in dev, unbranded and alarming in
 * production.
 *
 * `reset()` re-renders the segment, which recovers from transient
 * failures (a failed fetch, a race) without a full page reload.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with a real reporter (Sentry/Datadog) when one exists.
    // `digest` is the server-side hash Next assigns, which is what you'd
    // correlate against server logs in production.
    console.error("Route error:", error);
  }, [error]);

  return (
    <Section spacing="lg" className="flex flex-col items-center text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" aria-hidden />
      </div>

      <h1 className="mt-6 font-display text-display-lg text-foreground">Something went wrong</h1>
      <p className="mt-3 max-w-md text-body-lg text-muted-foreground">
        An unexpected error occurred. Trying again usually fixes it.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-caption text-muted-foreground">Reference: {error.digest}</p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" variant="gradient" onClick={reset}>
          <RefreshCw className="size-4" aria-hidden />
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Back to home
          </Link>
        </Button>
      </div>
    </Section>
  );
}
