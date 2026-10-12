"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Section } from "@/components/layout/section";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/features/consent/services/consent-service";
import { toast } from "@/hooks/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    // Previously this only showed "subscribed": no address was ever saved.
    setSubmitting(true);
    try {
      await subscribeToNewsletter(email.trim(), "homepage-newsletter");
      toast({ title: "You're subscribed!", description: "Care tips for your pet will land in your inbox.", variant: "success" });
      setEmail("");
    } catch {
      toast({ title: "Couldn't subscribe you", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section>
      <Reveal className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center shadow-2xl sm:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-mesh opacity-60"
        />
        <h2 className="font-display text-display-lg text-foreground">
          Stay ahead of your pet&apos;s needs
        </h2>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-muted-foreground">
          Care tips for your pet&apos;s age and breed, the best questions from
          the community, and new PetZu picks. No spam, ever.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
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
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              disabled={submitting}
              className="group w-full sm:w-auto"
            >
              {submitting ? "Subscribing..." : "Subscribe"}
              <Send className="size-4 transition-transform duration-200 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-1" />
            </Button>
          </Magnetic>
        </form>
      </Reveal>
    </Section>
  );
}
