import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSystemPrompt, SITE_GUIDE } from "./system-prompt";

const APP_DIR = path.resolve("app");

/** True if `segments` resolves to a page.tsx under app/, looking through (route-group) folders. */
function pageExists(dir: string, segments: string[]): boolean {
  if (segments.length === 0) {
    if (existsSync(path.join(dir, "page.tsx"))) return true;
  } else if (existsSync(path.join(dir, segments[0])) && pageExists(path.join(dir, segments[0]), segments.slice(1))) {
    return true;
  }
  return readdirSync(dir, { withFileTypes: true }).some(
    (entry) => entry.isDirectory() && /^\(.+\)$/.test(entry.name) && pageExists(path.join(dir, entry.name), segments),
  );
}

describe("SITE_GUIDE", () => {
  const paths = [...new Set(SITE_GUIDE.match(/(?<=\s|\()\/[a-z0-9\-/]*/g) ?? [])];

  it("mentions a healthy number of site paths", () => {
    expect(paths.length).toBeGreaterThan(20);
  });

  it.each(paths)("links to a page that exists: %s", (route) => {
    const segments = route.split("?")[0].split("/").filter(Boolean);
    expect(pageExists(APP_DIR, segments)).toBe(true);
  });

  it("contains no em dashes (client rule)", () => {
    expect(SITE_GUIDE.includes("— ")).toBe(false);
  });
});

describe("buildSystemPrompt", () => {
  it("puts the cacheable site guide first and per-question context after it", () => {
    const [guide, context] = buildSystemPrompt([]);
    expect(guide.text).toBe(SITE_GUIDE);
    expect(guide.cache_control).toEqual({ type: "ephemeral" });
    expect(context.cache_control).toBeUndefined();
    expect(context.text).toContain("No knowledge-base articles matched");
  });
});
