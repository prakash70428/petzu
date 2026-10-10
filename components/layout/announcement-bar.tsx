import { siteConfig } from "@/constants/site";

/**
 * Optional strip under the navbar (e.g. "Free shipping on orders over
 * ₹999"). Off unless `NEXT_PUBLIC_ANNOUNCEMENT` is set, so the business can
 * switch an offer on or off in Vercel's env settings without a code change.
 */
export function AnnouncementBar() {
  const message = siteConfig.announcement;
  if (!message) return null;

  return (
    <div role="region" aria-label="Announcement" className="bg-gradient-brand px-4 py-1.5 text-center text-caption font-medium text-primary-foreground">
      {message}
    </div>
  );
}
