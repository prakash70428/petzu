import type { Metadata } from "next";
import { GraduationCap, Home as HomeIcon, Scissors, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { cardVariants } from "@/components/ui/card";
import { buildMetadata } from "@/constants/seo";
import { getProvidersByType } from "@/features/services/utils";
import { cn } from "@/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  path: "/services",
  description: "Vet visits, grooming, training, and pet sitting — every care service PetZu offers, in one place.",
});

const serviceHubItems = [
  {
    icon: Stethoscope,
    title: "Vet booking",
    description: "Same-day video or in-clinic visits with licensed vets.",
    href: "/services/vet-booking",
    type: "vet" as const,
  },
  {
    icon: Scissors,
    title: "Grooming",
    description: "Professional grooming, in-studio or mobile.",
    href: "/services/grooming",
    type: "groomer" as const,
  },
  {
    icon: GraduationCap,
    title: "Training",
    description: "1:1 and group programs for every breed and age.",
    href: "/services/training",
    type: "trainer" as const,
  },
  {
    icon: HomeIcon,
    title: "Pet sitting",
    description: "Background-checked sitters and walkers when you're away.",
    href: "/services/sitting",
    type: "sitter" as const,
  },
];

export default function ServicesHubPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Services</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Services</h1>
        <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
          Everything beyond the cart — vetted providers for every kind of care your pet needs.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {serviceHubItems.map((item) => {
          const Icon = item.icon;
          const providerCount = getProvidersByType(item.type).length;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(cardVariants({ interactive: true }), "group flex items-start gap-4 p-card-lg")}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 ease-premium group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" aria-hidden />
              </div>
              <div>
                <h2 className="text-heading-4 font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-body-sm text-muted-foreground">{item.description}</p>
                <p className="mt-2 text-caption text-muted-foreground">
                  {providerCount} verified {providerCount === 1 ? "provider" : "providers"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
