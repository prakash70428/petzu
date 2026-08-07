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
  title: "Book a groomer",
  path: "/services/grooming",
  description: "Professional pet grooming — in-studio or mobile, booked in minutes.",
});

export default function GroomingPage() {
  const groomers = getProvidersByType("groomer");

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Grooming</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Book a groomer</h1>
        <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
          Professional grooming — in-studio or mobile, booked in minutes.
        </p>
      </div>

      <div className="mt-10">
        <ProviderListing providers={groomers} availableSpecialties={specialtiesByType.groomer} />
      </div>
    </Section>
  );
}
