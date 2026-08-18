import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { ArticleGrid } from "@/features/blog/components";
import { articles } from "@/features/blog/constants";

export const metadata: Metadata = buildMetadata({
  title: "Care guides",
  path: "/guides",
  description: "Vet-reviewed guides on nutrition, training, and grooming for every kind of pet.",
});

// "Engineering" is the blog's internal/dev category — not a pet-care guide,
// so it's excluded from what's presented as care guidance here.
const careGuides = articles.filter((article) => article.category !== "Engineering");

export default function GuidesPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Care guides</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">Care guides</h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          Vet-reviewed advice on nutrition, training, grooming, and everything in between —
          the same guides linked from the blog, gathered in one place.
        </p>
      </div>

      <div className="mt-10">
        <ArticleGrid articles={careGuides} emptyMessage="No guides published yet." />
      </div>
    </Section>
  );
}
