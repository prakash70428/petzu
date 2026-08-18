import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { blogPosts } from "../constants";

const tileGradients = [
  "from-primary/20 via-primary/5 to-transparent",
  "from-info/20 via-info/5 to-transparent",
  "from-success/20 via-success/5 to-transparent",
];

export function BlogPreview() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Keep learning</Badge>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            More than a community, a library too
          </h2>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-body-sm font-medium text-primary transition-colors hover:underline"
        >
          Visit the blog
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <RevealItem key={post.title}>
            <Link href="/blog" className="group block h-full">
              <Card interactive className="flex h-full flex-col overflow-hidden p-0">
                <div
                  className={cn(
                    "flex h-40 items-center justify-center bg-gradient-to-br",
                    tileGradients[index % tileGradients.length],
                  )}
                >
                  <Badge variant="secondary" className="glass">
                    {post.category}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-card">
                  <h3 className="text-body font-semibold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="flex-1 text-body-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-caption text-muted-foreground">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden /> {post.readTime}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
