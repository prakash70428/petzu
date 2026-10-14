export type CsvValue = string | number | boolean | Date | null | undefined;

/**
 * One CSV cell. Quotes when needed, and neutralises values that spreadsheet
 * apps would run as formulas (=, +, -, @ at the start): customer-typed text
 * goes into these files, so an export must never become a formula injection.
 */
export function csvCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** A whole CSV file with a header row. Starts with a BOM so Excel reads ₹ and Hindi text correctly. */
export function toCsv(columns: string[], rows: CsvValue[][]): string {
  const lines = [columns.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))];
  return `﻿${lines.join("\r\n")}\r\n`;
}
