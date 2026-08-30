import type { Metadata } from "next";
import { FileText, ShieldCheck, Wallet } from "lucide-react";
import { buildMetadata } from "@/constants/seo";
import { ServiceInfoPage } from "@/features/services/components";

export const metadata: Metadata = buildMetadata({
  title: "Pet Insurance",
  path: "/services/insurance",
  description:
    "Simple, reliable protection for your pet — with fewer worries and no surprises.",
});

export default function InsurancePage() {
  return (
    <ServiceInfoPage
      name="Pet Insurance"
      headline="Cover that makes sense"
      intro="Compare plans from insurers we've vetted, in plain language. Know what's
        covered, what isn't, and what you'll actually pay — before you sign
        anything."
      highlights={[
        {
          icon: FileText,
          title: "Plain-language plans",
          description:
            "Exclusions, waiting periods and payout limits laid out side by side — no fine-print traps.",
        },
        {
          icon: Wallet,
          title: "Predictable costs",
          description:
            "See premiums, excess and reimbursement rates up front, so a claim never comes with a shock.",
        },
        {
          icon: ShieldCheck,
          title: "Vetted insurers only",
          description:
            "We list providers with a real track record of paying valid claims, not just the cheapest quote.",
        },
      ]}
      cta={{
        heading: "Find the right plan",
        body: "Tell us your pet's age, breed and any existing conditions, and we'll shortlist plans that fit.",
        actionLabel: "Compare plans",
        actionHref: "/contact",
      }}
      note="Insurance is offered through licensed partners; PetZu is not the insurer. Regulated products, terms and availability vary by region."
    />
  );
}
