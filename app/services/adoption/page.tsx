import type { Metadata } from "next";
import { ClipboardCheck, HeartHandshake, Users } from "lucide-react";
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
        family — with honest histories, real support, and no adoption fees going
        anywhere but the animal's care."
      highlights={[
        {
          icon: Users,
          title: "Vetted shelters & rescues",
          description:
            "Every partner is checked for animal-welfare standards before a single listing goes live.",
        },
        {
          icon: ClipboardCheck,
          title: "Honest profiles",
          description:
            "Temperament, medical history and care needs up front, so there are no surprises after you bring them home.",
        },
        {
          icon: HeartHandshake,
          title: "Support after adoption",
          description:
            "Vet advice, food guidance and a settling-in checklist for the first few weeks — included.",
        },
      ]}
      cta={{
        heading: "Tell us who you're looking for",
        body: "Share your home, other pets and what you're hoping for, and our team will help you find a match.",
        actionLabel: "Talk to our adoption team",
        actionHref: "/contact",
      }}
      note="Adoption listings are rolling out city by city with our shelter partners. Reach out and we'll tell you what's available near you."
    />
  );
}
