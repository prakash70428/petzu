import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { ShopListing } from "@/features/shop/components";
import { products } from "@/features/shop/constants";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return buildMetadata({ title: q ? `Search results for "${q}"` : "Search", path: "/search" });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <Section spacing="sm">
      <div>
        <h1 className="font-display text-display-lg text-foreground">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}
        </h1>
        {!query && (
          <p className="mt-2 text-body-lg text-muted-foreground">
            Type something into the search bar to find products.
          </p>
        )}
      </div>

      <div className="mt-10">
        <ShopListing products={products} searchQuery={query} />
      </div>
    </Section>
  );
}
