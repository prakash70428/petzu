import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Author } from "../types";
import { formatDate, formatDateShort } from "../utils";

export interface AuthorBylineProps {
  author: Author;
  publishedAt: string;
  readTime: string;
  size?: "sm" | "md";
  /** Renders the author name as a link to their profile — disabled inside cards, where the whole card is already a link. */
  linkAuthor?: boolean;
}

export function AuthorByline({ author, publishedAt, readTime, size = "sm", linkAuthor = false }: AuthorBylineProps) {
  const nameEl = linkAuthor ? (
    <Link href={`/blog/author/${author.slug}`} className="font-medium text-foreground hover:underline">
      {author.name}
    </Link>
  ) : (
    <span className="font-medium text-foreground">{author.name}</span>
  );

  return (
    <div className="flex items-center gap-2.5">
      <Avatar size={size === "sm" ? "sm" : "md"}>
        <AvatarFallback>{author.initials}</AvatarFallback>
      </Avatar>
      <div className="text-caption text-muted-foreground">
        {nameEl}
        <div className="flex items-center gap-1.5">
          <time dateTime={publishedAt}>{size === "sm" ? formatDateShort(publishedAt) : formatDate(publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
}
