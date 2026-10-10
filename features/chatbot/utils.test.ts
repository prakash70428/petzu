import { describe, expect, it } from "vitest";
import { splitMessageLinks } from "./utils";

describe("splitMessageLinks", () => {
  it("turns site paths into internal links and keeps punctuation outside", () => {
    expect(splitMessageLinks("Book at /services/vet-booking.")).toEqual([
      { type: "text", value: "Book at " },
      { type: "internal", value: "/services/vet-booking" },
      { type: "text", value: "." },
    ]);
  });

  it("keeps query strings on shop filters", () => {
    expect(splitMessageLinks("See /shop?pet=cats for food")).toEqual([
      { type: "text", value: "See " },
      { type: "internal", value: "/shop?pet=cats" },
      { type: "text", value: " for food" },
    ]);
  });

  it("links full URLs as external", () => {
    expect(splitMessageLinks("More at https://example.com/a")).toEqual([
      { type: "text", value: "More at " },
      { type: "external", value: "https://example.com/a" },
    ]);
  });

  it("leaves slashes inside words alone", () => {
    expect(splitMessageLinks("Open 24/7, call and/or email")).toEqual([
      { type: "text", value: "Open 24/7, call and/or email" },
    ]);
  });

  it("returns plain text untouched", () => {
    expect(splitMessageLinks("Hello there")).toEqual([{ type: "text", value: "Hello there" }]);
  });
});
