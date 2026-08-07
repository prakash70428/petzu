import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { WishlistContent } from "@/features/wishlist/components";

export const metadata: Metadata = buildMetadata({ title: "Wishlist", path: "/wishlist" });

export default function WishlistPage() {
  return (
    <Section spacing="sm">
      <h1 className="font-display text-display-lg text-foreground">Your wishlist</h1>
      <div className="mt-10">
        <WishlistContent />
      </div>
    </Section>
  );
}
