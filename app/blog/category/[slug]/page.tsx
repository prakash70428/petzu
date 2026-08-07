import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { BlogListing } from "@/features/blog/components";
import { categories } from "@/features/blog/constants";
import { getArticlesByCategory, getCategoryBySlug, slugify } from "@/features/blog/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: slugify(category) }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Blog", path: "/blog" });

  return buildMetadata({
    title: category,
    path: `/blog/category/${slug}`,
    description: `${category} articles from The PetZu World blog.`,
  });
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryArticles = getArticlesByCategory(category);

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">{category}</h1>
        <p className="mt-2 text-body-sm text-muted-foreground">{categoryArticles.length} articles</p>
      </div>

      <div className="mt-10">
        <BlogListing articles={categoryArticles} activeCategory={slug} />
      </div>
    </Section>
  );
}
