import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { FaqAccordion } from "@/features/blog/components";
import { faqCategories } from "@/features/blog/constants";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  path: "/faq",
  description: "Answers to common questions about PetZu — orders, vet booking, grooming, and more.",
});

export default function FaqPage() {
  return (
    <Section spacing="sm">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-md">
          <HelpCircle className="size-7" aria-hidden />
        </div>
        <h1 className="mt-4 font-display text-display-lg text-foreground">Frequently asked questions</h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Reach out to support.
        </p>
      </div>

      <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-12">
        {faqCategories.map((category) => (
          <FaqAccordion key={category.title} category={category} />
        ))}
      </div>
    </Section>
  );
}
