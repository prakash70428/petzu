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
  title: "Book a pet sitter",
  path: "/services/sitting",
  description: "Pet sitters and walkers you can meet first, for when you're away.",
});

export default function SittingPage() {
  const sitters = getProvidersByType("sitter");

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pet sitting</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Book a pet sitter</h1>
        <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
          Pet sitters and walkers you can meet first, for when you&apos;re away.
        </p>
      </div>

      <div className="mt-10">
        <ProviderListing providers={sitters} availableSpecialties={specialtiesByType.sitter} />
      </div>
    </Section>
  );
}
