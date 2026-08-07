import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Base props every composable component may accept. */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/** A single navigable entry used by the navbar, footer, and sitemaps. */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

/** A group of nav items rendered together (e.g. a footer column). */
export interface NavSection {
  title: string;
  items: NavItem[];
}

/** A single link inside a mega-menu column. */
export interface MegaMenuLink {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

/** A column of related links inside a mega-menu dropdown. */
export interface MegaMenuColumn {
  title: string;
  links: MegaMenuLink[];
}

/** A top-level nav entry that may expand into a mega-menu dropdown. */
export interface MegaNavItem {
  label: string;
  href: string;
  megaMenu?: MegaMenuColumn[];
  /** Optional highlighted panel rendered alongside the columns (e.g. a promo). */
  featured?: MegaMenuLink;
}

/** Discriminated status for async UI states across features. */
export type AsyncStatus = "idle" | "loading" | "success" | "error";
