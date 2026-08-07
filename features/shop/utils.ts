import { priceBuckets, products } from "./constants";
import type { FilterState, PetType, Product, SortOption } from "./types";

/** Pure, testable filtering — kept out of components so listing/category/search pages share one implementation. */
export function filterProducts(items: Product[], filters: FilterState, query?: string): Product[] {
  const normalizedQuery = query?.trim().toLowerCase();

  return items.filter((product) => {
    if (filters.petTypes.length > 0 && !filters.petTypes.includes(product.petType)) {
      return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    if (filters.priceBuckets.length > 0) {
      const inAnyBucket = filters.priceBuckets.some((label) => {
        const bucket = priceBuckets.find((b) => b.label === label);
        if (!bucket) return false;
        return product.price >= bucket.min && (bucket.max === null || product.price < bucket.max);
      });
      if (!inAnyBucket) return false;
    }
    if (filters.minRating !== null && product.rating < filters.minRating) {
      return false;
    }
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }
    if (normalizedQuery) {
      const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    return true;
  });
}

export function sortProducts(items: Product[], sort: SortOption): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      return sorted.sort((a, b) => a.rank - b.rank);
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByPetType(petType: PetType): Product[] {
  return products.filter((product) => product.petType === petType);
}

/** Same category or same pet type as `product`, excluding itself, ranked by relevance then featured order. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .filter((candidate) => candidate.petType === product.petType || candidate.category === product.category)
    .sort((a, b) => {
      const aScore = (a.petType === product.petType ? 1 : 0) + (a.category === product.category ? 1 : 0);
      const bScore = (b.petType === product.petType ? 1 : 0) + (b.category === product.category ? 1 : 0);
      return bScore - aScore || a.rank - b.rank;
    })
    .slice(0, limit);
}

/** Re-exported from shared `utils/currency` so existing call sites keep working. */
export { formatPrice } from "@/utils/currency";
