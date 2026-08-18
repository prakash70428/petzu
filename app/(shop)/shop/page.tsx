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
import { petTypeIcons, petTypeLabels, productCategories, products } from "@/features/shop/constants";
import type { PetType } from "@/features/shop/types";
import { getProductsByPetType } from "@/features/shop/utils";

const petTypes = Object.keys(petTypeLabels) as PetType[];

interface ShopPageProps {
  searchParams: Promise<{ pet?: string; category?: string }>;
}

function resolvePetType(pet?: string): PetType | undefined {
  return pet && petTypes.includes(pet as PetType) ? (pet as PetType) : undefined;
}

function resolveCategory(category?: string): string | undefined {
  return category && productCategories.includes(category) ? category : undefined;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const { pet, category: categoryParam } = await searchParams;
  const petType = resolvePetType(pet);
  const category = resolveCategory(categoryParam);
  const title = petType ? petTypeLabels[petType] : category;

  if (!title) {
    return buildMetadata({
      title: "Shop",
      path: "/shop",
      description: "Vetted products for dogs, cats, birds, and small pets — delivered fast.",
    });
  }
  return buildMetadata({
    title,
    // Canonical stays on the base path — a filtered view is part of /shop's
    // content, not a distinct page, so it shouldn't compete with /shop for
    // search ranking (see app/sitemap.ts, which only lists /shop).
    path: "/shop",
    description: `Shop ${title.toLowerCase()} — vetted products, delivered fast.`,
  });
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { pet, category: categoryParam } = await searchParams;
  const petType = resolvePetType(pet);
  const category = resolveCategory(categoryParam);
  const label = petType ? petTypeLabels[petType] : category ?? null;
  const Icon = petType ? petTypeIcons[petType] : null;
  const listProducts = petType ? getProductsByPetType(petType) : products;

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {label ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Shop</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {Icon ? (
        <div className="mt-6 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-md">
            <Icon className="size-7" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-display-lg text-foreground">{label}</h1>
            <p className="mt-1 text-body-sm text-muted-foreground">
              {listProducts.length} products
            </p>
          </div>
        </div>
      ) : label ? (
        <div className="mt-6">
          <h1 className="font-display text-display-lg text-foreground">{label}</h1>
          <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
            Vetted {label.toLowerCase()} for every pet — delivered fast.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <h1 className="font-display text-display-lg text-foreground">Shop all products</h1>
          <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
            Vetted products for dogs, cats, birds, and small pets — delivered fast.
          </p>
        </div>
      )}

      <div className="mt-10">
        <ShopListing products={products} initialPetType={petType} initialCategory={category} />
      </div>
    </Section>
  );
}
