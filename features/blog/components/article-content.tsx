import { Quote } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";
import type { ContentBlock } from "../types";
import { slugify } from "../utils";
import { CodeBlock } from "./code-block";

/**
 * Only one article currently contains a `gallery` block, but this is a
 * Server Component rendering into every article page — a static import
 * would put the lightbox (client component + Dialog + Radix) into the
 * shared article bundle for all of them. `dynamic` scopes that cost to
 * the articles that actually use it.
 */
const ImageGallery = dynamic(
  () => import("./image-gallery").then((mod) => mod.ImageGallery),
  { loading: () => <Skeleton className="my-8 h-40 w-full rounded-xl" /> },
);

/**
 * The typography decisions live here, as utility classes per block, not a
 * separate `.prose` stylesheet — consistent with how every other surface
 * in this project is styled. `text-body-lg` + relaxed leading is the
 * "modern reading" pairing: large enough to read comfortably at arm's
 * length, loose enough leading that lines don't feel cramped.
 */
export function ArticleContent({ content }: { content: ContentBlock[] }) {
  return (
    <div className="flex flex-col">
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={index} className="mb-6 text-body-lg leading-relaxed text-foreground/90 last:mb-0">
                {block.text}
              </p>
            );

          case "heading": {
            const id = slugify(block.text);
            if (block.level === 2) {
              return (
                <h2
                  key={index}
                  id={id}
                  className="mb-4 mt-12 scroll-mt-28 font-display text-heading-2 font-semibold text-foreground first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3 key={index} id={id} className="mb-3 mt-8 scroll-mt-28 text-heading-3 font-semibold text-foreground">
                {block.text}
              </h3>
            );
          }

          case "code":
            return (
              <CodeBlock key={index} code={block.code} language={block.language} filename={block.filename} />
            );

          case "quote":
            return (
              <blockquote key={index} className="my-8 flex gap-4 border-l-4 border-primary/40 pl-6">
                <Quote className="mt-1 size-5 shrink-0 text-primary/50" aria-hidden />
                <div>
                  <p className="text-body-lg italic text-foreground">&ldquo;{block.text}&rdquo;</p>
                  {block.attribution && (
                    <cite className="mt-2 block text-body-sm not-italic text-muted-foreground">
                      — {block.attribution}
                    </cite>
                  )}
                </div>
              </blockquote>
            );

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={index}
                className={cn(
                  "mb-6 flex flex-col gap-2 pl-6 text-body-lg text-foreground/90 marker:text-primary",
                  block.ordered ? "list-decimal" : "list-disc",
                )}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </Tag>
            );
          }

          case "gallery":
            return <ImageGallery key={index} images={block.images} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
