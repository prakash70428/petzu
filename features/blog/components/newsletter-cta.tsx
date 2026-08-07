"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

/**
 * Same visual pattern as the homepage's Newsletter section, reimplemented
 * here (not imported) so the blog feature stays independent — see
 * STORE.md/SERVICES.md on why feature domains don't cross-import.
 */
export function NewsletterCta() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    toast({
      title: "You're subscribed!",
      description: "New articles will land in your inbox weekly.",
      variant: "success",
    });
    setEmail("");
  }

  return (
    <Reveal className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center shadow-2xl sm:p-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-mesh opacity-60" />
      <h2 className="font-display text-heading-1 text-foreground">Never miss a new article</h2>
      <p className="mx-auto mt-3 max-w-md text-body-lg text-muted-foreground">
        Vet-reviewed care guides, delivered weekly. No spam, ever.
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          inputSize="lg"
          className="flex-1"
          aria-label="Email address"
        />
        <Magnetic strength={0.3}>
          <Button type="submit" size="lg" variant="gradient" className="group w-full sm:w-auto">
            Subscribe
            <Send className="size-4 transition-transform duration-200 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-1" />
          </Button>
        </Magnetic>
      </form>
    </Reveal>
  );
}
