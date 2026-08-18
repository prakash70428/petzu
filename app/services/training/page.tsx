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
  title: "Book a trainer",
  path: "/services/training",
  description: "1:1 and group dog training programs, booked in minutes.",
});

export default function TrainingPage() {
  const trainers = getProvidersByType("trainer");

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Training</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Book a trainer</h1>
        <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
          1:1 and group training programs, tailored to every breed and age.
        </p>
      </div>

      <div className="mt-10">
        <ProviderListing providers={trainers} availableSpecialties={specialtiesByType.trainer} />
      </div>
    </Section>
  );
}
