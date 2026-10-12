import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { HealthHub } from "@/features/health/components/health-hub";

export const metadata: Metadata = buildMetadata({
  title: "Health records",
  path: "/health",
  description: "Your pet's medicines with reminders, notes for the vet, prescriptions and appointments, in one place.",
});

export default function HealthPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Health records</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">Health records</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">
          Medicines with reminders, notes for the vet before a visit, the prescription after it, and every
          appointment. Saved privately on this device.
        </p>
      </div>

      <div className="mt-10">
        <HealthHub />
      </div>
    </Section>
  );
}
