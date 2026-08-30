import type { Metadata } from "next";
import { Flower2, HandHeart, Home as HomeIcon } from "lucide-react";
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
      headline="Saying goodbye, with care"
      intro="When it's time, you shouldn't have to arrange everything alone. We help
        with gentle in-home care, respectful aftercare, and someone to talk to —
        so your pet's last day is calm and their memory is honoured."
      highlights={[
        {
          icon: HomeIcon,
          title: "At home, without rush",
          description:
            "A licensed vet can come to you, so your pet stays in a familiar place, surrounded by their family.",
        },
        {
          icon: Flower2,
          title: "Respectful aftercare",
          description:
            "Cremation and memorial options explained clearly and handled with care, with keepsakes if you want them.",
        },
        {
          icon: HandHeart,
          title: "Support for you",
          description:
            "Guidance on what to expect, and access to pet-loss resources and counsellors when you're ready.",
        },
      ]}
      cta={{
        heading: "Talk to someone",
        body: "Reach out whenever you need to — to plan ahead, or if today is the day. We'll take it at your pace.",
        actionLabel: "Contact our care team",
        actionHref: "/contact",
      }}
      note="In-home end-of-life care is available in select cities through our partner vets. Contact us and we'll tell you what we can arrange near you."
    />
  );
}
