import { BrandLoader } from "@/components/motion/brand-loader";

/**
 * Route-level Suspense fallback (Next renders this automatically while a
 * segment loads). Branded rather than a generic spinner — a loading state
 * is still part of the first impression.
 */
export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-section">
      <BrandLoader label="Loading PetZu…" />
    </div>
  );
}
