import { Check } from "lucide-react";
import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { siteConfig } from "@/constants/site";
import { PartnerForm } from "./partner-form";

export const metadata: Metadata = buildMetadata({
  title: "Partner with PetZu",
  path: "/partners",
  description: "Vets, groomers, trainers, sitters and pet businesses: reach pet parents near you through PetZu.",
});

const reasons = [
  "Get found by pet parents searching for care near them.",
  "Take bookings online, with clear prices you set yourself.",
  "Reach pet parents by animal and area, not by who pays for placement.",
  "No subscription: we only grow when you do.",
];

export default function PartnersPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Partners</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <h1 className="text-balance font-display text-display-lg text-foreground">
            Are you a pet business? Let&apos;s work together.
          </h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            We&apos;re building PetZu with vets, groomers, trainers, sitters, shelters and pharmacies who care about
            pets as much as we do.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {reasons.map((reason) => (
              <li key={reason} className="flex gap-3 text-body text-foreground/80">
                <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                {reason}
              </li>
            ))}
          </ul>
          {siteConfig.businessEmail ? (
            <p className="mt-8 text-body-sm text-muted-foreground">
              For business enquiries, you can also email{" "}
              <a href={`mailto:${siteConfig.businessEmail}`} className="font-medium text-primary hover:underline">
                {siteConfig.businessEmail}
              </a>
              .
            </p>
          ) : null}
        </div>

        <div className="relative">
          <h2 className="mb-6 font-display text-heading-2 text-foreground">Connect with us</h2>
          <PartnerForm />
        </div>
      </div>
    </Section>
  );
}
