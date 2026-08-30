import type { Metadata } from "next";
import { Clock, MapPin, PackageCheck } from "lucide-react";
import { buildMetadata } from "@/constants/seo";
import { ServiceInfoPage } from "@/features/services/components";

export const metadata: Metadata = buildMetadata({
  title: "Fast Delivery",
  path: "/services/delivery",
  description:
    "Pet food, treats and everyday essentials delivered quickly to your doorstep.",
});

export default function DeliveryPage() {
  return (
    <ServiceInfoPage
      name="Fast Delivery"
      headline="Pet essentials, at your door — fast"
      intro="Order food, treats, litter and everyday supplies and have them delivered
        quickly across the cities we serve. No last-minute pet-store runs."
      highlights={[
        {
          icon: Clock,
          title: "Same-day where available",
          description:
            "Order before the daily cut-off in a covered city and it arrives the same day. Everywhere else, next-day.",
        },
        {
          icon: PackageCheck,
          title: "Only what we'd give our own pets",
          description:
            "Every item is vet-checked and quality-screened before it's listed — no grey-market stock.",
        },
        {
          icon: MapPin,
          title: "Live tracking, door to door",
          description:
            "Follow your order from dispatch to doorstep, with a delivery window you can actually plan around.",
        },
      ]}
      cta={{
        heading: "Start your first order",
        body: "Browse the shop and check delivery speed for your area at checkout.",
        actionLabel: "Go to the shop",
        actionHref: "/shop",
      }}
      note="Same-day delivery is live in select cities and expanding. Enter your PIN code at checkout to see options for your area."
    />
  );
}
