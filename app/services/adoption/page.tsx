import type { Metadata } from "next";
import { buildMetadata } from "@/constants/seo";
import { ServiceInfoPage } from "@/features/services/components";

export const metadata: Metadata = buildMetadata({
  title: "Pet Adoption",
  path: "/services/adoption",
  description:
    "Find a pet to welcome home and give them the loving family they deserve.",
});

export default function AdoptionPage() {
  return (
    <ServiceInfoPage
      name="Pet Adoption"
      headline="Find a pet to welcome home"
      intro="We work with vetted shelters and rescues to match pets with the right
        family, with honest histories, real support, and no adoption fees going
        anywhere but the animal's care."
      action={{ label: "Talk to our adoption team", href: "/contact" }}
      body={{
        variant: "steps",
        title: "How adoption works",
        points: [
          {
            title: "Tell us about your home",
            description: "Your space, your routine, other pets, and who you're hoping to meet.",
          },
          {
            title: "Meet your match",
            description:
              "Honest profiles from vetted shelters: temperament, medical history and care needs, before you visit.",
          },
          {
            title: "Bring them home",
            description:
              "Vet advice, food guidance and a settling-in checklist for the first few weeks, all included.",
          },
        ],
      }}
      closing={{
        heading: "Ready to meet someone new?",
        body: "Tell us who you're looking for and our team will help you find the right match.",
      }}
      note="Adoption listings are rolling out city by city with our shelter partners. Reach out and we'll tell you what's available near you."
    />
  );
}
