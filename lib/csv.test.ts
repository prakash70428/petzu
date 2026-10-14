import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "./csv";

describe("csvCell", () => {
  it("quotes commas, quotes and new lines", () => {
    expect(csvCell("Bandra, Mumbai")).toBe('"Bandra, Mumbai"');
    expect(csvCell('He said "hi"')).toBe('"He said ""hi"""');
    expect(csvCell("line 1\nline 2")).toBe('"line 1\nline 2"');
  });

  it("neutralises spreadsheet formulas", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe("\"'=HYPERLINK(\"\"x\"\")\"");
    expect(csvCell("+91 98765")).toBe("'+91 98765");
    expect(csvCell("@sum")).toBe("'@sum");
  });

  it("writes empty cells for missing values and ISO dates", () => {
    expect(csvCell(null)).toBe("");
    expect(csvCell(undefined)).toBe("");
    expect(csvCell(new Date("2026-10-15T10:00:00Z"))).toBe("2026-10-15T10:00:00.000Z");
  });
});

describe("toCsv", () => {
  it("adds a BOM and a header row", () => {
    const csv = toCsv(["name", "price"], [["Bed", 1890]]);
    expect(csv.startsWith("﻿name,price\r\nBed,1890")).toBe(true);
  });
});
