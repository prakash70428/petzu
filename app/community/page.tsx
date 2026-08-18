import type { Metadata } from "next";
import { MessageSquare, PawPrint, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/constants/seo";
import { testimonials } from "@/features/home/constants";

export const metadata: Metadata = buildMetadata({
  title: "Community",
  path: "/community",
  description: "Pet parents comparing notes on vets, gear, and everything in between.",
});

const guidelines = [
  {
    icon: ShieldCheck,
    title: "No sales pitches",
    description: "Recommendations from real experience only — no affiliate links, no disguised ads.",
  },
  {
    icon: MessageSquare,
    title: "Be specific",
    description: "\"My anxious rescue needed 3 weeks\" beats \"training works great.\" Specifics help.",
  },
  {
    icon: PawPrint,
    title: "Every pet welcome",
    description: "Dogs, cats, birds, rabbits, fish — if you're caring for it, you belong here.",
  },
];

export default function CommunityPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Community</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <Badge variant="outline">Community</Badge>
        <h1 className="mt-4 font-display text-display-lg text-foreground">
          128,000+ pet parents, comparing notes
        </h1>
        <p className="mt-4 text-body-lg text-muted-foreground">
          The community started as a place to ask &ldquo;is this vet actually good?&rdquo; without wading through
          fake reviews. It&apos;s grown into where people share what&apos;s actually worked for their pets.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {guidelines.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-border p-card-lg">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden />
            </div>
            <h2 className="mt-5 text-heading-4 font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-heading-3 font-semibold text-foreground">What people are saying</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {testimonials.slice(0, 4).map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl border border-border p-card-lg">
              <p className="text-body-sm text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-4 text-body-sm font-medium text-foreground">{testimonial.name}</p>
              <p className="text-caption text-muted-foreground">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-secondary/40 p-card-lg text-center">
        <h2 className="text-heading-4 font-semibold text-foreground">Have something to share?</h2>
        <p className="max-w-md text-body-sm text-muted-foreground">
          Sign in and head to your dashboard to post — or start with the care guides for common questions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/sign-in">Sign in to post</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/guides">Browse care guides</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
