import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { ShopListing } from "@/features/shop/components";
import { products } from "@/features/shop/constants";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  path: "/shop",
  description: "Vetted products for dogs, cats, birds, and small pets — delivered fast.",
});

export default function ShopPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shop</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Shop all products</h1>
        <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
          Vetted products for dogs, cats, birds, and small pets — delivered fast.
        </p>
      </div>

      <div className="mt-10">
        <ShopListing products={products} />
      </div>
    </Section>
  );
}
