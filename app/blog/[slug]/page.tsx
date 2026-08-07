import { AtSign, Globe2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import {
  ArticleContent,
  ArticleReadingExperience,
  AuthorByline,
  NewsletterCta,
  RelatedArticles,
  TableOfContents,
} from "@/features/blog/components";
import { articles, blogIcons } from "@/features/blog/constants";
import {
  estimateReadTime,
  getArticleBySlug,
  getAuthorBySlug,
  getHeadings,
  getRelatedArticles,
  slugify,
} from "@/features/blog/utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Article not found", path: "/blog" });

  return buildMetadata({
    title: article.title,
    path: `/blog/${article.slug}`,
    description: article.excerpt,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const author = getAuthorBySlug(article.authorSlug);
  if (!author) notFound();

  const CoverIcon = blogIcons[article.coverIconKey];
  const readTime = estimateReadTime(article.content);
  const headings = getHeadings(article.content);
  const related = getRelatedArticles(article);
  const categorySlug = slugify(article.category);

  return (
    <>
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
              <BreadcrumbLink href={`/blog/category/${categorySlug}`}>{article.category}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mx-auto mt-6 max-w-3xl text-center">
          <Badge variant="secondary">{article.category}</Badge>
          <h1 className="mt-4 font-display text-display-lg text-foreground">{article.title}</h1>
          <p className="mt-4 text-body-lg text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 flex justify-center">
            <AuthorByline author={author} publishedAt={article.publishedAt} readTime={readTime} size="md" linkAuthor />
          </div>
        </div>

        <div className="mx-auto mt-10 flex aspect-[21/9] max-w-4xl items-center justify-center rounded-3xl bg-gradient-brand shadow-glow">
          <CoverIcon className="size-24 text-primary-foreground" strokeWidth={1} aria-hidden />
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_16rem]">
          <div className="mx-auto w-full max-w-[70ch]">
            <div className="mb-8 lg:hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value="toc">
                  <AccordionTrigger>On this page</AccordionTrigger>
                  <AccordionContent>
                    <TableOfContents headings={headings} hideLabel />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <ArticleReadingExperience>
              <ArticleContent content={article.content} />
            </ArticleReadingExperience>

            <div className="mt-16 flex items-start gap-4 rounded-2xl border border-border p-6">
              <Avatar size="lg">
                <AvatarFallback>{author.initials}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/blog/author/${author.slug}`} className="font-semibold text-foreground hover:underline">
                  {author.name}
                </Link>
                <p className="text-caption text-muted-foreground">{author.title}</p>
                <p className="mt-2 text-body-sm text-muted-foreground">{author.bio}</p>
                {author.social && (
                  <div className="mt-3 flex items-center gap-3">
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
            </div>
          </div>

          <aside className="hidden h-fit lg:sticky lg:top-24 lg:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </Section>

      <Section spacing="sm">
        <RelatedArticles articles={related} />
      </Section>

      <Section spacing="sm">
        <NewsletterCta />
      </Section>
    </>
  );
}
