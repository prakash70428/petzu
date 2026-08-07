import { describe, expect, it } from "vitest";
import { products } from "./constants";
import { EMPTY_FILTERS } from "./types";
import {
  filterProducts,
  formatPrice,
  getProductBySlug,
  getRelatedProducts,
  sortProducts,
} from "./utils";

describe("filterProducts", () => {
  it("returns everything when no filters are applied", () => {
    expect(filterProducts(products, EMPTY_FILTERS)).toHaveLength(products.length);
  });

  it("filters by pet type", () => {
    const result = filterProducts(products, { ...EMPTY_FILTERS, petTypes: ["cats"] });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.petType === "cats")).toBe(true);
  });

  it("treats multiple values within one facet as OR", () => {
    const result = filterProducts(products, { ...EMPTY_FILTERS, petTypes: ["cats", "dogs"] });
    expect(result.every((p) => p.petType === "cats" || p.petType === "dogs")).toBe(true);
  });

  it("treats separate facets as AND", () => {
    const result = filterProducts(products, {
      ...EMPTY_FILTERS,
      petTypes: ["dogs"],
      categories: ["Food & treats"],
    });
    expect(result.every((p) => p.petType === "dogs" && p.category === "Food & treats")).toBe(true);
  });

  it("respects price bucket boundaries as [min, max)", () => {
    const result = filterProducts(products, { ...EMPTY_FILTERS, priceBuckets: ["Under ₹25"] });
    expect(result.every((p) => p.price < 25)).toBe(true);
  });

  it("filters out-of-stock items when inStockOnly is set", () => {
    const result = filterProducts(products, { ...EMPTY_FILTERS, inStockOnly: true });
    expect(result.every((p) => p.inStock)).toBe(true);
    // Guard against a vacuous pass — the catalog must actually contain
    // an out-of-stock item for this assertion to mean anything.
    expect(products.some((p) => !p.inStock)).toBe(true);
  });

  it("matches the search query against name, category and description", () => {
    expect(filterProducts(products, EMPTY_FILTERS, "harness").length).toBeGreaterThan(0);
    expect(filterProducts(products, EMPTY_FILTERS, "zzzznotathing")).toHaveLength(0);
  });

  it("is case-insensitive and ignores surrounding whitespace", () => {
    const a = filterProducts(products, EMPTY_FILTERS, "HARNESS");
    const b = filterProducts(products, EMPTY_FILTERS, "  harness  ");
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });
});

describe("sortProducts", () => {
  it("sorts price ascending and descending", () => {
    const asc = sortProducts(products, "price-asc").map((p) => p.price);
    expect([...asc].sort((a, b) => a - b)).toEqual(asc);

    const desc = sortProducts(products, "price-desc").map((p) => p.price);
    expect([...desc].sort((a, b) => b - a)).toEqual(desc);
  });

  it("sorts rating descending", () => {
    const ratings = sortProducts(products, "rating").map((p) => p.rating);
    expect([...ratings].sort((a, b) => b - a)).toEqual(ratings);
  });

  it("does not mutate the input array", () => {
    const original = [...products];
    sortProducts(products, "price-desc");
    expect(products).toEqual(original);
  });
});

describe("getRelatedProducts", () => {
  it("never includes the product itself and respects the limit", () => {
    const product = products[0];
    const related = getRelatedProducts(product, 3);
    expect(related).toHaveLength(3);
    expect(related.some((p) => p.id === product.id)).toBe(false);
  });

  it("ranks same-pet-type-and-category matches first", () => {
    const product = getProductBySlug("grain-free-salmon-recipe")!;
    const [first] = getRelatedProducts(product);
    expect(first.petType === product.petType || first.category === product.category).toBe(true);
  });
});

describe("formatPrice", () => {
  it("drops a trailing .00 but keeps real cents", () => {
    expect(formatPrice(54)).toBe("₹54");
    expect(formatPrice(54.5)).toBe("₹54.50");
    expect(formatPrice(0)).toBe("₹0");
  });
});

describe("catalog data integrity", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("never shows a discount that is not a discount", () => {
    for (const p of products) {
      if (p.originalPrice !== undefined) expect(p.originalPrice).toBeGreaterThan(p.price);
    }
  });
});
