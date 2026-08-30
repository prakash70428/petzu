import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export interface ServiceHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ServiceInfoPageProps {
  /** Short name for the breadcrumb (e.g. "Pet Adoption"). */
  name: string;
  /** Page <h1>. */
  headline: string;
  /** One or two sentences under the headline. */
  intro: string;
  /** Three-up feature/benefit cards. */
  highlights: ServiceHighlight[];
  cta: {
    heading: string;
    body: string;
    actionLabel: string;
    actionHref: string;
  };
  /** Optional small print under the CTA (e.g. rollout status). */
  note?: string;
}

/**
 * Shared layout for the informational service pages that don't (yet) have a
 * provider-booking flow — Adoption, Holidays, Celebrations, The Last Journey,
 * Insurance, Delivery. Keeps every one of them visually consistent with the
 * provider-backed service pages (breadcrumb → headline → 3-up grid) while the
 * real booking experience is still being built.
 */
export function ServiceInfoPage({
  name,
  headline,
  intro,
  highlights,
  cta,
  note,
}: ServiceInfoPageProps) {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/services">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">{headline}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{intro}</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-border p-card-lg">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden />
            </div>
            <h2 className="mt-5 text-heading-4 font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-secondary/40 p-card-lg text-center">
        <h2 className="text-heading-4 font-semibold text-foreground">{cta.heading}</h2>
        <p className="max-w-md text-body-sm text-muted-foreground">{cta.body}</p>
        <Button asChild>
          <Link href={cta.actionHref}>{cta.actionLabel}</Link>
        </Button>
      </div>

      {note ? (
        <p className="mx-auto mt-8 max-w-xl text-center text-caption text-muted-foreground">
          {note}
        </p>
      ) : null}
    </Section>
  );
}
