import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { specialtiesByType } from "@/features/services/constants";
import { ProviderListing } from "@/features/services/components";
import { getProvidersByType } from "@/features/services/utils";

export const metadata: Metadata = buildMetadata({
  title: "Book a vet",
  path: "/services/vet-booking",
  description: "Same-day and scheduled vet appointments — licensed, verified veterinarians near you.",
});

export default function VetBookingPage() {
  const vets = getProvidersByType("vet");

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Vet booking</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Book a vet</h1>
        <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
          Licensed, verified veterinarians — same-day video consults or in-clinic visits.
        </p>
      </div>

      <div className="mt-10">
        <ProviderListing providers={vets} availableSpecialties={specialtiesByType.vet} />
      </div>
    </Section>
  );
}
