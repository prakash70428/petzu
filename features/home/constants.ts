import {
  Bath,
  Clock,
  Flower2,
  GraduationCap,
  Home as HomeIcon,
  type LucideIcon,
  Palmtree,
  PartyPopper,
  PawPrint,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LifeStage } from "@/features/pet-profile/types";

/**
 * All homepage copy and content lives here, separate from the section
 * components that render it — swapping real product/vet/testimonial data
 * in later means editing this file, not hunting through JSX.
 */

export type ServiceStageKey = "welcome" | "care" | "life" | "goodbye";

/**
 * Services follow a pet's life, from the day they come home to saying
 * goodbye (client feedback: The Last Journey sat in the middle of the grid,
 * adoption should come first). The order here is the order shown everywhere.
 */
export const serviceStages: { key: ServiceStageKey; title: string }[] = [
  { key: "welcome", title: "Welcome home" },
  { key: "care", title: "Health & care" },
  { key: "life", title: "Life together" },
  { key: "goodbye", title: "Saying goodbye" },
];

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  stage: ServiceStageKey;
}

export const services: ServiceItem[] = [
  {
    icon: PawPrint,
    title: "Pet Adoption",
    description: "Find a pet to welcome home and give them the loving family they deserve.",
    href: "/services/adoption",
    stage: "welcome",
  },
  {
    icon: ShoppingBag,
    title: "Pet Essentials",
    description: "Find trusted food, treats and everyday essentials picked for your pet.",
    href: "/shop",
    stage: "welcome",
  },
  {
    icon: Stethoscope,
    title: "Vet Care",
    description: "Book trusted video consultations or clinic visits with qualified vets near you.",
    href: "/services/vet-booking",
    stage: "care",
  },
  {
    icon: Bath,
    title: "Grooming & Spa",
    description: "Book professional grooming and spa care with trusted PetZu partners.",
    href: "/services/grooming",
    stage: "care",
  },
  {
    icon: ShieldCheck,
    title: "Pet Insurance",
    description: "Simple, reliable protection for your pet, with fewer worries and no surprises.",
    href: "/services/insurance",
    stage: "care",
  },
  {
    icon: Palmtree,
    title: "Pet Holidays",
    description: "Trusted stays, boarding and pet-friendly getaways for your pet.",
    href: "/services/holidays",
    stage: "life",
  },
  {
    icon: PartyPopper,
    title: "Pet Celebrations",
    description: "Make birthdays and special moments memorable with celebrations made for pets.",
    href: "/services/celebrations",
    stage: "life",
  },
  {
    icon: GraduationCap,
    title: "Training",
    description: "Personalised 1:1 and group training for every breed, age and stage.",
    href: "/services/training",
    stage: "life",
  },
  {
    icon: HomeIcon,
    title: "Pet Sitting",
    description: "Sitters and walkers to look after your pet when you're away.",
    href: "/services/sitting",
    stage: "life",
  },
  {
    icon: Flower2,
    title: "The Last Journey",
    description: "Compassionate support to help you say goodbye with dignity, care and love.",
    href: "/services/the-last-journey",
    stage: "goodbye",
  },
];

export interface GalleryItem {
  image: string;
  alt: string;
  caption: string;
  href: string;
}

export const lifestyleGallery: GalleryItem[] = [
  {
    image: "/images/img6.jpeg",
    alt: "A golden retriever beside a full set of at-home grooming tools",
    caption: "Grooming kit, sorted",
    href: `/shop?category=${encodeURIComponent("Health & wellness")}`,
  },
  {
    image: "/images/img3.jpeg",
    alt: "A golden retriever sitting next to treat pouches and a bowl of food",
    caption: "Treats they'll actually sit for",
    href: `/shop?category=${encodeURIComponent("Food & treats")}`,
  },
  {
    image: "/images/img2.jpeg",
    alt: "A golden retriever with a lineup of pet bath and coat-care products",
    caption: "Bath-time essentials",
    href: "/shop",
  },
];

export const vetBookingFeatures: string[] = [
  "Vet clinics near you, on a live map",
  "Specialties from vaccinations to surgery",
  "Video or in-clinic consultations",
  "Your pet's health records, all in one place",
];

export interface WhyPetzuItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const whyPetzu: WhyPetzuItem[] = [
  {
    icon: ShieldCheck,
    title: "Chosen with care",
    description: "We pick every product and partner ourselves, the way we'd choose for our own pets.",
  },
  {
    icon: Clock,
    title: "Answers any time",
    description: "Our assistant replies straight away, day or night, and passes you to the team when it can't help.",
  },
  {
    icon: Users,
    title: "A community first",
    description: "Ask other pet parents which vet, food or groomer actually worked for them.",
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

/**
 * What to put first for a pet at each life stage (client feedback point 15:
 * "it will personalise the website for you and update yearly"). Values are
 * `services[].href`s, in order; "/health" is the health records hub.
 */
export const servicesByLifeStage: Record<LifeStage, { hrefs: string[]; why: string }> = {
  baby: {
    hrefs: ["/services/vet-booking", "/services/training", "/shop", "/health"],
    why: "First vaccinations, house training and the basics for a new arrival.",
  },
  teen: {
    hrefs: ["/services/training", "/services/grooming", "/services/sitting", "/services/vet-booking"],
    why: "Lots of energy, a growing coat and a routine that's still settling.",
  },
  adult: {
    hrefs: ["/services/vet-booking", "/services/grooming", "/services/holidays", "/services/insurance"],
    why: "Yearly check-ups, regular grooming and trips you can take together.",
  },
  senior: {
    hrefs: ["/services/vet-booking", "/health", "/services/insurance", "/services/sitting"],
    why: "More frequent vet visits, medicines on time and gentler care.",
  },
  "last-journey": {
    hrefs: ["/services/the-last-journey", "/services/vet-booking", "/health", "/community"],
    why: "Comfort, a vet who can come to you, and people who understand.",
  },
};
