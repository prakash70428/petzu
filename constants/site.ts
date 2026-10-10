import {
  Bath,
  Bird,
  BookOpen,
  Cat,
  Dog,
  Flower2,
  Gamepad2,
  GraduationCap,
  Home as HomeIcon,
  LayoutGrid,
  Palmtree,
  PartyPopper,
  PawPrint,
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
    "PetZu is a site for all things pet: trusted products, vets and groomers you can book, care guides and a community of pet parents.",
  url: "https://thepetzu.com",
  /** Public inbox for customers; shown on /contact only when set. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  /** Inbox for business and partnership enquiries; shown on /partners only when set. */
  businessEmail: process.env.NEXT_PUBLIC_BUSINESS_EMAIL?.trim() ?? "",
  /** Strip shown under the navbar (see AnnouncementBar). Empty = hidden. */
  announcement: process.env.NEXT_PUBLIC_ANNOUNCEMENT?.trim() ?? "",
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
          { label: "Grooming & spa", href: "/services/grooming", icon: Bath },
          { label: "Training", href: "/services/training", icon: GraduationCap },
          { label: "Pet sitting", href: "/services/sitting", icon: HomeIcon },
          { label: "Pet insurance", href: "/services/insurance", icon: ShieldCheck },
        ],
      },
      {
        // Every service page must be reachable from the menu, not only from
        // a homepage card (client feedback: The Last Journey was click-only).
        title: "Life moments",
        links: [
          { label: "Pet adoption", href: "/services/adoption", icon: PawPrint },
          { label: "Pet holidays", href: "/services/holidays", icon: Palmtree },
          { label: "Pet celebrations", href: "/services/celebrations", icon: PartyPopper },
          { label: "The Last Journey", href: "/services/the-last-journey", icon: Flower2 },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "All services", href: "/services", icon: LayoutGrid },
          { label: "Care guides", href: "/guides", icon: BookOpen },
          { label: "Community", href: "/community", icon: Users },
        ],
      },
    ],
  },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
];

export const footerNav: NavSection[] = [
  {
    // Order per client: community first, then services, then shop.
    title: "Explore",
    items: [
      { label: "Community", href: "/community" },
      { label: "Services", href: "/services" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Our story", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Partner with us", href: "/partners" },
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
