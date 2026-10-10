import type { Metadata } from "next";
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
      action={{ label: "Enquire about a stay", href: "/contact" }}
      body={{
        variant: "list",
        title: "What you can book",
        points: [
          {
            title: "Home stays",
            description: "A quiet home with a single family, for pets who do best with one-on-one attention.",
          },
          {
            title: "Boarding",
            description: "Professional facilities with set routines, play time and staff on site.",
          },
          {
            title: "Pet-friendly getaways",
            description: "Stays that genuinely welcome pets, not the ones that merely tolerate them.",
          },
          {
            title: "Checked, insured hosts",
            description: "Every host is background-checked, reference-verified and covered while your pet is with them.",
          },
        ],
      }}
      closing={{
        heading: "Going away soon?",
        body: "Tell us your dates, your pet and where you're headed, and we'll line up options.",
      }}
      note="Boarding and home-stay hosts are onboarding now. Get in touch with your dates and we'll match you with what's available."
    />
  );
}
