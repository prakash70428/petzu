import {
  Award,
  Bird,
  Bone,
  Cat,
  Clock,
  Dog,
  Gamepad2,
  Heart,
  Home as HomeIcon,
  Lightbulb,
  type LucideIcon,
  Rabbit,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Truck,
  Users,
  Utensils,
} from "lucide-react";

/**
 * All homepage copy and content lives here, separate from the section
 * components that render it — swapping real product/vet/testimonial data
 * in later means editing this file, not hunting through JSX.
 */

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export const stats: Stat[] = [
  { label: "Pets cared for", value: 128000, suffix: "+" },
  { label: "Verified vets", value: 500, suffix: "+" },
  { label: "Cities covered", value: 6 },
  { label: "5-star reviews", value: 2000, suffix: "+" },
];

/** Presented as text wordmarks rather than logo images — no real partner
 * logo assets exist yet, and a fake/placeholder logo image reads worse
 * than an honest typographic treatment. */
export const trustedBrands: string[] = [
  "Whisker & Co.",
  "Pawfect Supply",
  "Nordic Vet Group",
  "TrailPaws",
  "Bloom Pet Care",
  "Furlong Foods",
  "Companion Health",
  "The Kennel Club",
];

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Short label for the card's call-to-action link. */
  cta: string;
  href: string;
}

export const services: ServiceItem[] = [
  {
    icon: Lightbulb,
    title: "Get Expert Pet Advice",
    description: "Personalised guidance for your pet's everyday needs.",
    cta: "Expert Advice",
    href: "/guides",
  },
  {
    icon: Stethoscope,
    title: "Consult a Vet",
    description: "Trusted veterinary care, when your pet needs it.",
    cta: "Consult a Vet",
    href: "/services/vet-booking",
  },
  {
    icon: ShoppingBag,
    title: "Shop Trusted Pet Essentials",
    description: "Carefully selected products for happier, healthier pets.",
    cta: "Shop Essentials",
    href: "/shop",
  },
  {
    icon: Sparkles,
    title: "Plan Spa, Stays & Getaways",
    description: "From grooming and pampering to trusted stays and pet-friendly holidays.",
    cta: "Spa & Getaways",
    href: "/services/grooming",
  },
];

export interface CategoryItem {
  icon: LucideIcon;
  label: string;
  count: string;
  href: string;
}

export const categories: CategoryItem[] = [
  { icon: Dog, label: "Dogs", count: "3,200+ products", href: "/shop?pet=dogs" },
  { icon: Cat, label: "Cats", count: "2,600+ products", href: "/shop?pet=cats" },
  { icon: Bird, label: "Birds", count: "740+ products", href: "/shop?pet=birds" },
  { icon: Rabbit, label: "Small pets", count: "510+ products", href: "/shop?pet=small-pets" },
  { icon: Bone, label: "Aquatics", count: "390+ products", href: "/shop?pet=aquatics" },
];

export interface Product {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  icon: LucideIcon;
}

export const featuredProducts: Product[] = [
  {
    name: "Orthopedic Memory Foam Bed",
    category: "Beds & furniture",
    price: 89,
    originalPrice: 119,
    rating: 4.8,
    reviewCount: 1204,
    badge: "Bestseller",
    icon: HomeIcon,
  },
  {
    name: "Grain-Free Salmon Recipe",
    category: "Food & treats",
    price: 54,
    rating: 4.9,
    reviewCount: 2310,
    badge: "Vet recommended",
    icon: Utensils,
  },
  {
    name: "Interactive Puzzle Feeder",
    category: "Toys & enrichment",
    price: 28,
    rating: 4.7,
    reviewCount: 856,
    icon: Gamepad2,
  },
  {
    name: "Adjustable Step-In Harness",
    category: "Gear & accessories",
    price: 32,
    rating: 4.6,
    reviewCount: 512,
    badge: "New",
    icon: ShieldCheck,
  },
];

export const vetBookingFeatures: string[] = [
  "Same-day appointments, 7 days a week",
  "100% licensed & background-checked vets",
  "Video consults or in-clinic visits",
  "Digital health records, always in sync",
];

export interface WhyPetzuItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const whyPetzu: WhyPetzuItem[] = [
  {
    icon: ShieldCheck,
    title: "Vetted & verified",
    description: "Every product, vet, and sitter is screened before it reaches you.",
  },
  {
    icon: Clock,
    title: "24/7 support",
    description: "Real humans (and a few very good dogs) on call around the clock.",
  },
  {
    icon: Truck,
    title: "Fast, reliable delivery",
    description: "Same-day in most cities, tracked door to door.",
  },
  {
    icon: Heart,
    title: "Built with love for pets",
    description: "Founded by pet parents, for pet parents, not investors.",
  },
  {
    icon: Award,
    title: "Award-winning care",
    description: "Recognized three years running for customer satisfaction.",
  },
  {
    icon: Users,
    title: "A real community",
    description: "Hundreds of thousands of pet parents swapping advice daily.",
  },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    role: "Dog mom to Biscuit",
    quote:
      "The vet booking feature alone is worth it. Had a same-day video call when Biscuit wasn't eating. Turned out to be nothing serious, but the peace of mind was everything.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "James R.",
    role: "Cat dad to Luna & Mochi",
    quote:
      "Delivery is genuinely fast, and the food recommendations actually match what my vet suggested. Cancelled two other subscriptions after switching.",
    rating: 5,
    initials: "JR",
  },
  {
    name: "Priya K.",
    role: "Rescue volunteer",
    quote:
      "We've rehomed a dozen dogs through the community boards. The whole platform feels like it's actually built by people who love animals.",
    rating: 5,
    initials: "PK",
  },
  {
    name: "Diego F.",
    role: "First-time pet parent",
    quote:
      "As someone who had no idea what I was doing with a new puppy, the training program and care guides made the first month so much less overwhelming.",
    rating: 4,
    initials: "DF",
  },
];

export interface CommunityPost {
  author: string;
  initials: string;
  content: string;
  likes: number;
  tag: string;
}

export const communityPosts: CommunityPost[] = [
  {
    author: "Maya T.",
    initials: "MT",
    content: "Finally found a harness that doesn't rub Kiwi's chest raw. Linked it below for anyone else with a wriggly whippet 🐕",
    likes: 214,
    tag: "Gear",
  },
  {
    author: "Owen L.",
    initials: "OL",
    content: "PSA: booked a same-day vet call at 11pm when my cat wouldn't stop pacing. Turned out fine, but the response time was unreal.",
    likes: 189,
    tag: "Vet care",
  },
  {
    author: "Renee A.",
    initials: "RA",
    content: "Three months into raw feeding and the difference in her coat is wild. Happy to share the transition plan if anyone's curious.",
    likes: 342,
    tag: "Nutrition",
  },
];

export interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "5 signs your dog needs a vet visit, not just a Google search",
    excerpt: "Vets weigh in on the symptoms that separate 'keep an eye on it' from 'come in today.'",
    category: "Vet care",
    readTime: "6 min read",
    date: "Jul 28",
  },
  {
    title: "The complete guide to kitten nutrition, month by month",
    excerpt: "What to feed, how much, and when to transition: a feeding timeline vets actually recommend.",
    category: "Nutrition",
    readTime: "9 min read",
    date: "Jul 21",
  },
  {
    title: "How to actually choose a pet insurance plan",
    excerpt: "The fine print that matters, the questions to ask, and what most plans quietly exclude.",
    category: "Guides",
    readTime: "7 min read",
    date: "Jul 14",
  },
];
