"use client";

import { Apple, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

/** Decorative on purpose — real OAuth needs a real backend, so these are honest about not doing anything yet rather than silently failing. */
export function SocialAuthButtons() {
  function handleClick(provider: string) {
    toast({
      title: "Not available in this demo",
      description: `${provider} sign-in requires a backend — this milestone is frontend only.`,
      variant: "info",
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" onClick={() => handleClick("Google")}>
        <Globe2 className="size-4" aria-hidden />
        Google
      </Button>
      <Button variant="outline" onClick={() => handleClick("Apple")}>
        <Apple className="size-4" aria-hidden />
        Apple
      </Button>
    </div>
  );
}
