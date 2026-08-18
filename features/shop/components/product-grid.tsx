import { PackageSearch } from "lucide-react";
import { MountRevealGroup, RevealItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { Product } from "../types";
import { ProductCard } from "./product-card";

export interface ProductGridProps {
  products: Product[];
  onClearFilters?: () => void;
}

export function ProductGrid({ products, onClearFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
        <PackageSearch className="size-10 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">No products match your filters</p>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Try removing a filter or searching for something else.
          </p>
        </div>
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <MountRevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {products.map((product, index) => (
        <RevealItem key={product.id}>
          <ProductCard product={product} index={index} />
        </RevealItem>
      ))}
    </MountRevealGroup>
  );
}
