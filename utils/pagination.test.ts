import { describe, expect, it } from "vitest";
import { getPaginationRange } from "./pagination";

describe("getPaginationRange", () => {
  it("lists every page without ellipses when the total fits", () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("always includes the first and last page", () => {
    const range = getPaginationRange(10, 20);
    expect(range[0]).toBe(1);
    expect(range[range.length - 1]).toBe(20);
  });

  it("collapses only the right side when near the start", () => {
    const range = getPaginationRange(2, 20);
    expect(range.filter((item) => item === "ellipsis")).toHaveLength(1);
    expect(range).toContain(1);
    expect(range).toContain(20);
  });

  it("collapses only the left side when near the end", () => {
    const range = getPaginationRange(19, 20);
    expect(range.filter((item) => item === "ellipsis")).toHaveLength(1);
  });

  it("collapses both sides in the middle", () => {
    const range = getPaginationRange(10, 20);
    expect(range.filter((item) => item === "ellipsis")).toHaveLength(2);
    expect(range).toContain(10);
  });

  it("always surfaces the current page", () => {
    for (const page of [1, 2, 7, 13, 20]) {
      expect(getPaginationRange(page, 20)).toContain(page);
    }
  });

  it("handles the single-page edge case", () => {
    expect(getPaginationRange(1, 1)).toEqual([1]);
  });

  it("never emits duplicate page numbers", () => {
    for (const page of [1, 5, 10, 15, 20]) {
      const numbers = getPaginationRange(page, 20).filter((i): i is number => typeof i === "number");
      expect(new Set(numbers).size).toBe(numbers.length);
    }
  });
});
