import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { petTypeIcons, petTypeLabels } from "@/features/shop/constants";
import type { PetType } from "@/features/shop/types";
import { getProductsByPetType } from "@/features/shop/utils";

const petTypes = Object.keys(petTypeLabels) as PetType[];

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return petTypes.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const petType = slug as PetType;
  if (!petTypes.includes(petType)) return buildMetadata({ title: "Shop", path: "/shop" });

  const label = petTypeLabels[petType];
  return buildMetadata({
    title: label,
    path: `/shop/${petType}`,
    description: `Shop everything for your ${label.toLowerCase()} — vetted products, delivered fast.`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const petType = slug as PetType;
  if (!petTypes.includes(petType)) notFound();

  const Icon = petTypeIcons[petType];
  const label = petTypeLabels[petType];
  const categoryProducts = getProductsByPetType(petType);

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-md">
          <Icon className="size-7" aria-hidden />
        </div>
        <div>
          <h1 className="font-display text-display-lg text-foreground">{label}</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            {categoryProducts.length} products
          </p>
        </div>
      </div>

      <div className="mt-10">
        <ShopListing products={categoryProducts} />
      </div>
    </Section>
  );
}
