import type { Metadata } from "next";
import { BedDouble, MapPin, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/constants/seo";
import { ServiceInfoPage } from "@/features/services/components";

export const metadata: Metadata = buildMetadata({
  title: "Pet Holidays",
  path: "/services/holidays",
  description: "Trusted stays, boarding and pet-friendly getaways for your pet.",
});

export default function HolidaysPage() {
  return (
    <ServiceInfoPage
      name="Pet Holidays"
      headline="Somewhere safe for your pet to stay"
      intro="Whether you're travelling without them or planning a trip together, book
        boarding, home-stays and pet-friendly getaways from hosts we've checked
        ourselves."
      highlights={[
        {
          icon: ShieldCheck,
          title: "Checked, insured hosts",
          description:
            "Every boarder and host is background-checked, reference-verified and covered while your pet is with them.",
        },
        {
          icon: BedDouble,
          title: "Home stays or boarding",
          description:
            "Pick a quiet home with a single family or a professional boarding facility — whatever suits your pet.",
        },
        {
          icon: MapPin,
          title: "Pet-friendly getaways",
          description:
            "Curated stays that genuinely welcome pets — not the ones that merely tolerate them.",
        },
      ]}
      cta={{
        heading: "Plan your pet's stay",
        body: "Tell us your dates, your pet and where you're headed, and we'll line up options.",
        actionLabel: "Enquire about a stay",
        actionHref: "/contact",
      }}
      note="Boarding and home-stay hosts are onboarding now. Get in touch with your dates and we'll match you with what's available."
    />
  );
}
