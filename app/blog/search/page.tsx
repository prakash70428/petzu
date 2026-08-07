import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { BlogListing } from "@/features/blog/components";
import { articles } from "@/features/blog/constants";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return buildMetadata({ title: q ? `Search results for "${q}"` : "Search", path: "/blog/search" });
}

export default async function BlogSearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <Section spacing="sm">
      <h1 className="font-display text-display-lg text-foreground">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search the blog"}
      </h1>

      <div className="mt-10">
        <BlogListing articles={articles} initialQuery={query} />
      </div>
    </Section>
  );
}
