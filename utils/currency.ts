/** The app's display currency, in one place. */
export const CURRENCY_SYMBOL = "₹";

/**
 * Canonical money formatter for the whole app.
 *
 * This lives in shared `utils/` rather than a feature folder because four
 * separate features need it (shop, services, dashboard, home) — which is
 * exactly the promotion rule from ARCHITECTURE.md. Before this it existed
 * as three near-identical private copies, so a currency change meant
 * editing three files and hoping none were missed. Now it's one line.
 *
 * Uses the `en-IN` locale so large amounts group the Indian way
 * (₹1,00,000 — lakh grouping), not the western way (₹100,000). Getting
 * this wrong is the most common tell that a store was built for one
 * market and had a currency symbol swapped in afterwards.
 *
 * Paise are shown only when they exist, so whole amounts read as ₹3,499
 * rather than ₹3,499.00.
 */
export function formatPrice(value: number): string {
  const hasPaise = !Number.isInteger(value);
  const formatted = value.toLocaleString("en-IN", {
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${CURRENCY_SYMBOL}${formatted}`;
}
