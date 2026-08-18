import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  path: "/terms",
  description: `The terms that govern using ${siteConfig.name}.`,
});

const sections = [
  {
    title: "Using PetZu",
    body: "By creating an account or placing an order, you agree to these terms. You must be at least 18 to create an account or make a booking on behalf of a pet in your care.",
  },
  {
    title: "Orders and bookings",
    body: "Product availability, pricing, and delivery windows are shown at checkout and may change before an order is placed. Service bookings (vet, grooming, training, sitting) are made directly with independent providers listed on PetZu; PetZu facilitates the booking but the provider delivers the service.",
  },
  {
    title: "Cancellations",
    body: "Orders can be cancelled before they ship from your dashboard. Booking cancellation windows are set by each provider and shown at the time of booking.",
  },
  {
    title: "Account responsibilities",
    body: "You're responsible for keeping your account credentials secure and for the accuracy of the information you provide (pet details, contact info, delivery address).",
  },
  {
    title: "Content and reviews",
    body: "Reviews and community posts must be honest and based on real experience. We reserve the right to remove content that's abusive, fraudulent, or unrelated to pet care.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms as the product evolves. Material changes will be noted on this page with an updated date.",
  },
];

export default function TermsPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Terms of Service</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">Terms of Service</h1>
        <p className="mt-2 text-body-sm text-muted-foreground">Last updated August 2026</p>
      </div>

      <div className="mt-10 max-w-2xl">
        {sections.map((section) => (
          <div key={section.title} className="mb-8 last:mb-0">
            <h2 className="mb-3 text-heading-3 font-semibold text-foreground">{section.title}</h2>
            <p className="text-body-lg leading-relaxed text-foreground/90">{section.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
