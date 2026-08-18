import {
  Bird,
  BookOpen,
  Cat,
  Dog,
  Gamepad2,
  GraduationCap,
  Home as HomeIcon,
  Rabbit,
  ShieldCheck,
  Sofa,
  Stethoscope,
  Users,
  Utensils,
} from "lucide-react";
import type { MegaNavItem, NavItem, NavSection } from "@/types";

/**
 * Single source of truth for brand identity and SEO defaults.
 * Referenced by app/layout.tsx metadata, the navbar, and the footer.
 */
export const siteConfig = {
  name: "The PetZu World",
  shortName: "PetZu",
  description:
    "The PetZu World is a modern platform for pet lovers — discover products, care guides, and a community built around your pets.",
  url: "https://thepetzu.world",
  locale: "en_US",
  keywords: [
    "PetZu",
    "pet care",
    "pet products",
    "pet community",
    "pet marketplace",
  ],
  socials: {
    twitter: "@thepetzuworld",
    instagram: "https://instagram.com/thepetzuworld",
    facebook: "https://facebook.com/thepetzuworld",
  },
} as const;

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Richer nav config that powers the desktop mega menu. Kept separate from
 * `primaryNav` (used for the simple mobile menu) because mega-menu columns
 * only make sense as a hover/focus-revealed desktop affordance.
 */
export const megaNav: MegaNavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    megaMenu: [
      {
        title: "Shop by pet",
        links: [
          { label: "Dogs", href: "/shop?pet=dogs", icon: Dog },
          { label: "Cats", href: "/shop?pet=cats", icon: Cat },
          { label: "Birds", href: "/shop?pet=birds", icon: Bird },
          { label: "Small pets", href: "/shop?pet=small-pets", icon: Rabbit },
        ],
      },
      {
        title: "Shop by category",
        links: [
          { label: "Food & treats", href: `/shop?category=${encodeURIComponent("Food & treats")}`, icon: Utensils },
          { label: "Toys & enrichment", href: `/shop?category=${encodeURIComponent("Toys & enrichment")}`, icon: Gamepad2 },
          { label: "Health & wellness", href: `/shop?category=${encodeURIComponent("Health & wellness")}`, icon: ShieldCheck },
          { label: "Beds & furniture", href: `/shop?category=${encodeURIComponent("Beds & furniture")}`, icon: Sofa },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    megaMenu: [
      {
        title: "Care services",
        links: [
          { label: "Vet booking", href: "/services/vet-booking", icon: Stethoscope },
          { label: "Grooming", href: "/services/grooming", icon: Sofa },
          { label: "Training", href: "/services/training", icon: GraduationCap },
          { label: "Pet sitting", href: "/services/sitting", icon: HomeIcon },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Care guides", href: "/guides", icon: BookOpen },
          { label: "Community", href: "/community", icon: Users },
        ],
      },
    ],
  },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavSection[] = [
  {
    title: "Product",
    items: [
      { label: "Shop", href: "/shop" },
      { label: "Pricing", href: "/pricing" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
