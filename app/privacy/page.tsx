import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
});

const sections = [
  {
    title: "What we collect",
    body: "Account details you provide directly (name, email, saved pets), order and booking history, and basic usage data (pages viewed, features used) to keep the product working well.",
  },
  {
    title: "How we use it",
    body: "To fulfill orders and bookings, personalize recommendations, send service updates you've opted into, and improve the product. We don't sell your data to third parties.",
  },
  {
    title: "How we protect it",
    body: "Account data is encrypted in transit and at rest. Access is limited to the systems and people who need it to operate the service.",
  },
  {
    title: "Your choices",
    body: "You can view and update your saved information from your dashboard at any time, opt out of marketing emails, and request account deletion by contacting us.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies to keep you signed in and remember cart/wishlist state, and lightweight analytics cookies to understand how the site is used.",
  },
  {
    title: "Contact",
    body: "Questions about this policy can be sent through the contact page — we read every message.",
  },
];

export default function PrivacyPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-display-lg text-foreground">Privacy Policy</h1>
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
