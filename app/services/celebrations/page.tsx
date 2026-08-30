import type { Metadata } from "next";
import { Cake, Camera, Gift } from "lucide-react";
import { buildMetadata } from "@/constants/seo";
import { ServiceInfoPage } from "@/features/services/components";

export const metadata: Metadata = buildMetadata({
  title: "Pet Celebrations",
  path: "/services/celebrations",
  description:
    "Make birthdays and special moments memorable with celebrations made for pets.",
});

export default function CelebrationsPage() {
  return (
    <ServiceInfoPage
      name="Pet Celebrations"
      headline="Make the moment count"
      intro="Gotcha days, birthdays, homecomings — mark them with treats, gifts and
        keepsakes put together for pets and the people who love them."
      highlights={[
        {
          icon: Cake,
          title: "Vet-safe treats & cakes",
          description:
            "Celebration bakes and treat boxes made with pet-safe ingredients — no xylitol, no chocolate, no guesswork.",
        },
        {
          icon: Gift,
          title: "Curated gift boxes",
          description:
            "Toys, chews and accessories bundled by pet type and size, delivered ready to unwrap.",
        },
        {
          icon: Camera,
          title: "Keepsakes",
          description:
            "Paw-print kits, photo props and milestone cards to hold on to the day.",
        },
      ]}
      cta={{
        heading: "Plan a celebration",
        body: "Tell us the occasion and your pet, and we'll suggest a treat box or gift bundle.",
        actionLabel: "Start planning",
        actionHref: "/contact",
      }}
      note="Celebration boxes ship in the cities we currently deliver to. Ask us what's available near you."
    />
  );
}
