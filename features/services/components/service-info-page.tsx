import { ArrowRight, Check } from "lucide-react";
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
import { cn } from "@/utils/cn";

export interface ServicePoint {
  title: string;
  description: string;
}

export interface ServiceAction {
  label: string;
  href: string;
}

export interface ServiceInfoPageProps {
  /** Short name for the breadcrumb (e.g. "Pet Adoption"). */
  name: string;
  /** Page <h1>. */
  headline: string;
  /** One or two sentences under the headline. */
  intro: string;
  /** The page's main action, shown right under the intro. */
  action: ServiceAction;
  /**
   * The body of the page. The layout is chosen per page so every service
   * reads differently instead of the same three boxes everywhere:
   * - "steps": a numbered 1-2-3 process (adoption, insurance)
   * - "list": a checklist of what's on offer (holidays, celebrations)
   * - "prose": calm paragraphs with no icons (The Last Journey)
   */
  body: {
    variant: "steps" | "list" | "prose";
    title: string;
    points: ServicePoint[];
  };
  /** Closing band: a reason to act, repeated with the same action. */
  closing: { heading: string; body: string };
  /** Optional small print (e.g. rollout status). */
  note?: string;
  /** "gentle" softens the buttons and spacing for sensitive pages. */
  tone?: "default" | "gentle";
}

function Steps({ points }: { points: ServicePoint[] }) {
  return (
    <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      {/* Connector line behind the numbers on desktop. */}
      <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
      {points.map((point, index) => (
        <li key={point.title} className="relative flex gap-4 md:flex-col">
          <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand font-display text-heading-4 text-primary-foreground shadow-md">
            {index + 1}
          </span>
          <div>
            <h3 className="text-heading-4 font-semibold text-foreground">{point.title}</h3>
            <p className="mt-1.5 text-body text-foreground/75">{point.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Checklist({ points }: { points: ServicePoint[] }) {
  return (
    <ul className="grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-2 md:divide-y-0">
      {points.map((point, index) => (
        <li
          key={point.title}
          className={cn(
            "flex gap-3 py-5 md:px-2",
            // Row dividers on desktop, where the list is two columns wide.
            index >= 2 && "md:border-t md:border-border",
          )}
        >
          <Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h3 className="font-semibold text-foreground">{point.title}</h3>
            <p className="mt-1 text-body-sm text-foreground/75">{point.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Prose({ points }: { points: ServicePoint[] }) {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      {points.map((point) => (
        <div key={point.title}>
          <h3 className="font-display text-heading-3 text-foreground">{point.title}</h3>
          <p className="mt-2 text-body-lg leading-relaxed text-foreground/75">{point.description}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Layout for the informational service pages that don't have a provider
 * booking flow yet (Adoption, Holidays, Celebrations, The Last Journey,
 * Insurance). The action sits in the hero rather than at the bottom of a
 * row of boxes, and each page picks the body layout that fits its content.
 */
export function ServiceInfoPage({ name, headline, intro, action, body, closing, note, tone = "default" }: ServiceInfoPageProps) {
  const gentle = tone === "gentle";

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

      <header className="mt-6 max-w-2xl">
        <h1 className="text-balance font-display text-display-lg text-foreground">{headline}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{intro}</p>
        <Button asChild size="lg" variant={gentle ? "outline" : "gradient"} className="group mt-8">
          <Link href={action.href}>
            {action.label}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </Link>
        </Button>
      </header>

      <section className={cn(gentle ? "mt-16" : "mt-20")} aria-labelledby="service-body-title">
        <h2 id="service-body-title" className="mb-8 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          {body.title}
        </h2>
        {body.variant === "steps" && <Steps points={body.points} />}
        {body.variant === "list" && <Checklist points={body.points} />}
        {body.variant === "prose" && <Prose points={body.points} />}
      </section>

      <section className="mt-20 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-heading-2 text-foreground">{closing.heading}</h2>
          <p className="mt-2 text-body text-muted-foreground">{closing.body}</p>
        </div>
        <Button asChild size="lg" variant={gentle ? "outline" : "gradient"} className="shrink-0">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      </section>

      {note ? <p className="mt-8 max-w-xl text-caption text-muted-foreground">{note}</p> : null}
    </Section>
  );
}
