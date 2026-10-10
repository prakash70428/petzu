import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/constants/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our story",
  path: "/about",
  description: "PetZu is named after Zuzu, our family's dog. This is why we built it, and what we're building for pet parents.",
});

const values = [
  {
    title: "Vetted, not just listed",
    description: "Every product and provider on PetZu is reviewed before it reaches you. No pay-to-rank shelf space.",
  },
  {
    title: "Care that shows up",
    description: "Same-day vet visits, because pet emergencies don't wait and neither do we.",
  },
  {
    title: "Built with pet parents",
    description: "Every feature started as a problem a pet parent actually had, like finding a decent vet at 9pm on a Sunday.",
  },
];

/**
 * The only page that shows Zuzu's photo (client request: the family's dog
 * belongs here, not across the site).
 */
export default function AboutPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Our story</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-display-lg text-foreground">Named after Zuzu</h1>
          <p className="mt-6 text-body-lg leading-relaxed text-foreground/85">
            PetZu is named after Zuzu, our dear family member, who passed away on 20 May. He was the reason we
            learned how much goes into caring for a pet, and how hard it can be to find the right help. We&apos;re
            building PetZu in his name.
          </p>
          <p className="mt-4 text-body-lg leading-relaxed text-muted-foreground">
            Finding a trustworthy vet, a good groomer, and food that wasn&apos;t secretly bad for him meant
            juggling a dozen apps and forum threads. PetZu is the one place we wished we&apos;d had: vetted
            products, vets and groomers you can book directly, and a community of pet parents comparing notes.
          </p>
          <Button asChild size="lg" variant="gradient" className="mt-8">
            <Link href="/services">Explore our services</Link>
          </Button>
        </div>

        <figure className="mx-auto w-full max-w-xs">
          <div className="relative aspect-[705/1280] overflow-hidden rounded-[2rem] shadow-lg">
            <Image
              src="/images/petzucutedog.jpeg"
              alt="Zuzu, the golden retriever PetZu is named after"
              fill
              sizes="(min-width: 1024px) 20rem, 90vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-center text-body-sm text-muted-foreground">Zuzu</figcaption>
        </figure>
      </div>

      <section className="mt-20 border-t border-border pt-10">
        <h2 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">What we stand for</h2>
        <dl className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map(({ title, description }) => (
            <div key={title}>
              <dt className="font-display text-heading-4 text-foreground">{title}</dt>
              <dd className="mt-2 text-body text-foreground/75">{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-16 text-body-sm text-muted-foreground">
        Have a pet story, a complaint, or a feature idea? We read everything that comes through{" "}
        <Link href="/contact" className="font-medium text-primary hover:underline">
          the contact page
        </Link>
        .
      </p>
    </Section>
  );
}
