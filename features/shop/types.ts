export type PetType = "dogs" | "cats" | "birds" | "small-pets" | "aquatics";

/**
 * Products are authored in a Server Component (the catalog is static data)
 * but rendered by Client Components (cards need hooks for cart/wishlist
 * state). React Server Components can't pass function values as props
 * across that boundary — so icons are referenced by string key here and
 * resolved to the actual Lucide component via `productIcons` only inside
 * client code, never carried on the `Product` object itself.
 */
export type IconKey =
  | "home"
  | "utensils"
  | "gamepad"
  | "shield"
  | "package"
  | "leaf"
  | "droplet"
  | "syringe";

export interface ProductVariant {
  label: string;
  /** Tailwind gradient stops reused for both the swatch dot and the showcase tint. */
  swatchClassName: string;
}

export interface ProductDetail {
  title: string;
  content: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  petType: PetType;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  iconKey: IconKey;
  description: string;
  details: ProductDetail[];
  inStock: boolean;
  /** Lower = more "featured" — powers the default (Featured) sort order. */
  rank: number;
  variants?: ProductVariant[];
}

export interface FilterState {
  petTypes: PetType[];
  categories: string[];
  priceBuckets: string[];
  minRating: number | null;
  inStockOnly: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  petTypes: [],
  categories: [],
  priceBuckets: [],
  minRating: null,
  inStockOnly: false,
};

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export interface PriceBucket {
  label: string;
  min: number;
  max: number | null;
}
