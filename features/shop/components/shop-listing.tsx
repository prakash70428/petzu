"use client";

import { useMemo, useState } from "react";
import { EMPTY_FILTERS, type FilterState, type PetType, type Product, type SortOption } from "../types";
import { filterProducts, sortProducts } from "../utils";
import { FiltersPanel } from "./filters-panel";
import { ProductGrid } from "./product-grid";
import { Toolbar } from "./toolbar";

export interface ShopListingProps {
  products: Product[];
  searchQuery?: string;
  /** Pre-selects the "pet type" filter — how `/shop?pet=dogs` replaces a dedicated `/shop/dogs` route. */
  initialPetType?: PetType;
  /** Pre-selects the "category" filter — how `/shop?category=Grooming` replaces a dedicated category route. */
  initialCategory?: string;
}

/**
 * The interactive core shared by the listing, category, and search pages —
 * each just passes a different base product set and header. Filter/sort
 * state lives here (client-only, not in the URL) since this is a UI-only
 * store with no backend to make server-driven filtering worthwhile.
 */
export function ShopListing({ products, searchQuery, initialPetType, initialCategory }: ShopListingProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...EMPTY_FILTERS,
    petTypes: initialPetType ? [initialPetType] : [],
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sort, setSort] = useState<SortOption>("featured");

  const visibleProducts = useMemo(() => {
    return sortProducts(filterProducts(products, filters, searchQuery), sort);
  }, [products, filters, sort, searchQuery]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:block">
        <FiltersPanel filters={filters} onChange={setFilters} />
      </aside>
      <div className="flex flex-col gap-6">
        <Toolbar
          resultCount={visibleProducts.length}
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
        />
        <ProductGrid products={visibleProducts} onClearFilters={() => setFilters(EMPTY_FILTERS)} />
      </div>
    </div>
  );
}
