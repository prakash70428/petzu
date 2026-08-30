import type { Metadata } from "next";
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
import { services } from "@/features/home/constants";
import type { ProviderType } from "@/features/services/types";
import { getProvidersByType } from "@/features/services/utils";
import { cn } from "@/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  path: "/services",
  description:
    "Vet care, grooming, training, sitting, adoption, holidays and more — every way PetZu helps you care for your pet, in one place.",
});

/** The four services backed by a live provider-booking flow — used to show a
 * verified-provider count on their cards. Everything else is informational. */
const providerTypeByHref: Partial<Record<string, ProviderType>> = {
  "/services/vet-booking": "vet",
  "/services/grooming": "groomer",
  "/services/training": "trainer",
  "/services/sitting": "sitter",
};

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

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">Services</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">
          From expert advice and veterinary care to grooming, trusted products
          and holidays — everything your pet needs, in one place.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          const providerType = providerTypeByHref[service.href];
          const providerCount = providerType
            ? getProvidersByType(providerType).length
            : 0;

          return (
            <Link
              key={service.href}
              href={service.href}
              className={cn(
                cardVariants({ interactive: true }),
                "group flex items-start gap-4 p-card-lg",
              )}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 ease-premium group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" aria-hidden />
              </div>
              <div>
                <h2 className="text-heading-4 font-semibold text-foreground">
                  {service.title}
                </h2>
                <p className="mt-1 text-body-sm text-muted-foreground">
                  {service.description}
                </p>
                {providerCount > 0 ? (
                  <p className="mt-2 text-caption text-muted-foreground">
                    {providerCount} verified{" "}
                    {providerCount === 1 ? "provider" : "providers"}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
