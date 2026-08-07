import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { CartPageContent } from "@/features/cart/components";

export const metadata: Metadata = buildMetadata({ title: "Your cart", path: "/cart" });

export default function CartPage() {
  return (
    <Section spacing="sm">
      <h1 className="font-display text-display-lg text-foreground">Your cart</h1>
      <div className="mt-10">
        <CartPageContent />
      </div>
    </Section>
  );
}
