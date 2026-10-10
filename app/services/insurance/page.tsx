import type { Metadata } from "next";
import { buildMetadata } from "@/constants/seo";
import { ServiceInfoPage } from "@/features/services/components";

export const metadata: Metadata = buildMetadata({
  title: "Pet Insurance",
  path: "/services/insurance",
  description:
    "Simple, reliable protection for your pet, with fewer worries and no surprises.",
});

export default function InsurancePage() {
  return (
    <ServiceInfoPage
      name="Pet Insurance"
      headline="Cover that makes sense"
      intro="Compare plans from insurers we've vetted, in plain language. Know what's
        covered, what isn't, and what you'll actually pay, before you sign
        anything."
      action={{ label: "Get my plan shortlist", href: "/contact" }}
      body={{
        variant: "steps",
        title: "How it works",
        points: [
          {
            title: "Tell us about your pet",
            description: "Age, breed and any existing conditions. It takes about two minutes.",
          },
          {
            title: "Compare plain-language plans",
            description:
              "Premiums, exclusions, waiting periods and payout limits side by side, with no fine print hiding anything.",
          },
          {
            title: "Choose with confidence",
            description:
              "Only insurers with a real record of paying valid claims make the list, not just the cheapest quote.",
          },
        ],
      }}
      closing={{
        heading: "A vet bill shouldn't be a shock",
        body: "Get a shortlist of plans that fit your pet, explained in plain language.",
      }}
      note="Insurance is offered through licensed partners; PetZu is not the insurer. Regulated products, terms and availability vary by region."
    />
  );
}
