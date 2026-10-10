import type { Metadata } from "next";
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
      intro="Gotcha days, birthdays, homecomings: mark them with treats, gifts and
        keepsakes put together for pets and the people who love them."
      action={{ label: "Plan a celebration", href: "/contact" }}
      body={{
        variant: "list",
        title: "Ideas for the day",
        points: [
          {
            title: "Pet-safe cakes and treats",
            description: "Celebration bakes made without xylitol, chocolate or guesswork.",
          },
          {
            title: "Gift boxes",
            description: "Toys, chews and accessories picked for your pet's type and size, packed ready to unwrap.",
          },
          {
            title: "Keepsakes",
            description: "Paw-print kits, photo props and milestone cards to hold on to the day.",
          },
          {
            title: "Help planning",
            description: "Tell us the occasion and we'll suggest what fits your pet and your budget.",
          },
        ],
      }}
      closing={{
        heading: "Big day coming up?",
        body: "Tell us the occasion and your pet, and we'll suggest a treat box or gift bundle.",
      }}
      note="Celebration boxes are available in select cities. Ask us what's available near you."
    />
  );
}
