import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { BlogListing, NewsletterCta } from "@/features/blog/components";
import { articles } from "@/features/blog/constants";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  path: "/blog",
  description: "Vet-reviewed care guides, nutrition advice, and training tips for pet parents.",
});

export default function BlogPage() {
  return (
    <>
      <Section spacing="sm">
        <div>
          <h1 className="font-display text-display-lg text-foreground">The PetZu Blog</h1>
          <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
            Vet-reviewed care guides, nutrition advice, and training tips — written by people who
            actually know pets.
          </p>
        </div>

        <div className="mt-10">
          <BlogListing articles={articles} />
        </div>
      </Section>

      <Section spacing="sm">
        <NewsletterCta />
      </Section>
    </>
  );
}
