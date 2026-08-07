/**
 * Same "icon referenced by string key" pattern as features/shop/types.ts
 * (see that file's note, or DESIGN_SYSTEM.md) — cover/gallery placeholders
 * are rendered by Server Components and read by Client Components, so the
 * icon can't be a component reference on the data itself. Defined
 * independently here (not imported from shop) so the two feature domains
 * stay deletable without depending on each other.
 */
export type IconKey =
  | "stethoscope"
  | "utensils"
  | "dumbbell"
  | "scissors"
  | "users"
  | "code"
  | "book";

export interface Author {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  initials: string;
  social?: {
    twitter?: string;
    website?: string;
  };
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "gallery"; images: { caption: string; iconKey: IconKey }[] };

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorSlug: string;
  publishedAt: string;
  coverIconKey: IconKey;
  content: ContentBlock[];
}

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}
