import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { ServiceStages } from "@/features/home/components/service-stages";
import type { ProviderType } from "@/features/services/types";
import { getProvidersByType } from "@/features/services/utils";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  path: "/services",
  description:
    "Vet care, grooming, training, sitting, adoption, holidays and more: every way PetZu helps you care for your pet, in one place.",
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
          and holidays: everything your pet needs, in one place.
        </p>
        <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-secondary px-4 py-2 text-body-sm text-foreground">
          <span className="font-medium">Pay per booking, not per month.</span>
          <span className="text-muted-foreground">
            No subscription tier: each provider sets their price and you see it before you book.
          </span>
        </p>
      </div>

      <ServiceStages
        detailed
        className="mt-12"
        renderMeta={(service) => {
          const providerType = providerTypeByHref[service.href];
          const providerCount = providerType ? getProvidersByType(providerType).length : 0;
          return providerCount > 0 ? (
            <span className="mt-1 block text-caption text-muted-foreground">
              {providerCount} verified {providerCount === 1 ? "provider" : "providers"}
            </span>
          ) : null;
        }}
      />
    </Section>
  );
}
