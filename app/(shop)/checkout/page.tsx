import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { CheckoutForm } from "@/features/checkout/components";

export const metadata: Metadata = buildMetadata({ title: "Checkout", path: "/checkout" });

export default function CheckoutPage() {
  return (
    <Section spacing="sm">
      <h1 className="font-display text-display-lg text-foreground">Checkout</h1>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </Section>
  );
}
