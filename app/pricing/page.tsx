import type { Metadata } from "next";
import { Check, Truck, Users } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/constants/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  path: "/pricing",
  description: "How pricing works on PetZu — no subscriptions, no hidden fees.",
});

const items = [
  {
    icon: Truck,
    title: "Free shipping over ₹999",
    description: "Every order — no membership required. Below that, flat ₹99 shipping.",
  },
  {
    icon: Check,
    title: "Pay per booking, not per month",
    description: "Vet, groomer, trainer, and sitter prices are set by each provider — see the exact price before you book, no PetZu markup.",
  },
  {
    icon: Users,
    title: "No subscription tier",
    description: "PetZu isn't a membership product. You pay for what you order and book, nothing else.",
  },
];

export default function PricingPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Pricing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">How pricing works</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">
          PetZu is a marketplace, not a subscription, so there&apos;s no pricing tier to pick. You pay
          product prices in the shop and provider-set prices for bookings, that&apos;s it.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, description }) => (
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
        <h2 className="text-heading-4 font-semibold text-foreground">Ready to start?</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/shop">Browse the shop</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">See service pricing</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
