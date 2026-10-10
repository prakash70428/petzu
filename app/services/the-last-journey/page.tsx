import type { Metadata } from "next";
import { buildMetadata } from "@/constants/seo";
import { ServiceInfoPage } from "@/features/services/components";

export const metadata: Metadata = buildMetadata({
  title: "The Last Journey",
  path: "/services/the-last-journey",
  description:
    "Compassionate support to help you say goodbye with dignity, care and love.",
});

export default function TheLastJourneyPage() {
  return (
    <ServiceInfoPage
      name="The Last Journey"
      tone="gentle"
      headline="Saying goodbye, with care"
      intro="When it's time, you shouldn't have to arrange everything alone. We help
        with gentle in-home care, respectful aftercare, and someone to talk to,
        so your pet's last day is calm and their memory is honoured."
      action={{ label: "Talk to our care team", href: "/contact" }}
      body={{
        variant: "prose",
        title: "How we can help",
        points: [
          {
            title: "At home, without rush",
            description:
              "A licensed vet can come to you, so your pet stays in a familiar place, surrounded by their family.",
          },
          {
            title: "Respectful aftercare",
            description:
              "Cremation and memorial options explained clearly and handled with care, with keepsakes if you want them.",
          },
          {
            title: "Support for you",
            description:
              "Guidance on what to expect, and access to pet-loss resources and counsellors when you're ready.",
          },
        ],
      }}
      closing={{
        heading: "We're here when you need us",
        body: "Reach out whenever you need to, whether to plan ahead or because today is the day. We'll take it at your pace.",
      }}
      note="In-home end-of-life care is available in select cities through our partner vets. Contact us and we'll tell you what we can arrange near you."
    />
  );
}
