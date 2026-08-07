import { AtSign, Globe2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { ArticleGrid } from "@/features/blog/components";
import { authors } from "@/features/blog/constants";
import { getArticlesByAuthor, getAuthorBySlug } from "@/features/blog/utils";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return buildMetadata({ title: "Author not found", path: "/blog" });

  return buildMetadata({
    title: author.name,
    path: `/blog/author/${author.slug}`,
    description: author.bio,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const authorArticles = getArticlesByAuthor(author.slug);

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
            <BreadcrumbPage>{author.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center text-center">
        <Avatar size="xl">
          <AvatarFallback>{author.initials}</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 text-heading-1 font-semibold text-foreground">{author.name}</h1>
        <p className="mt-1 text-body-lg text-muted-foreground">{author.title}</p>
        <p className="mt-4 text-body-sm text-muted-foreground">{author.bio}</p>
        {author.social && (
          <div className="mt-4 flex items-center gap-4">
            {author.social.twitter && (
              <span className="flex items-center gap-1 text-caption text-muted-foreground">
                <AtSign className="size-3.5" aria-hidden />
                {author.social.twitter}
              </span>
            )}
            {author.social.website && (
              <span className="flex items-center gap-1 text-caption text-muted-foreground">
                <Globe2 className="size-3.5" aria-hidden />
                {author.social.website}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-heading-4 font-semibold text-foreground">
          {authorArticles.length} {authorArticles.length === 1 ? "article" : "articles"}
        </h2>
        <div className="mt-6">
          <ArticleGrid articles={authorArticles} />
        </div>
      </div>
    </Section>
  );
}
