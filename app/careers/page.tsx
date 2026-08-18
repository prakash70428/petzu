import type { Metadata } from "next";
import { Heart, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/constants/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  path: "/careers",
  description: "We're not hiring right now, but here's what working at PetZu is about.",
});

const values = [
  {
    icon: Heart,
    title: "Pet parents first",
    description: "Every decision gets weighed against one question: does this actually help someone caring for a pet?",
  },
  {
    icon: Sparkles,
    title: "Small team, real ownership",
    description: "We stay small on purpose — every hire owns a real slice of the product, not a sliver of a process.",
  },
];

export default function CareersPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Careers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">Careers at PetZu</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">
          There are no open roles listed right now, but we&apos;re always happy to hear from people who
          care about pets and good products. Reach out and tell us what you&apos;d want to work on.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {values.map(({ icon: Icon, title, description }) => (
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
        <Mail className="size-6 text-primary" aria-hidden />
        <h2 className="text-heading-4 font-semibold text-foreground">No open roles right now</h2>
        <p className="max-w-md text-body-sm text-muted-foreground">
          Send us a note through the contact page and we&apos;ll keep it on file for when a role opens up.
        </p>
        <Button asChild>
          <Link href="/contact">Get in touch</Link>
        </Button>
      </div>
    </Section>
  );
}
