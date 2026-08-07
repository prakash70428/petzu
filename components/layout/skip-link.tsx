/**
 * Hidden until focused, then pinned to the top-left. Without this, a
 * keyboard user has to tab through the full mega menu, search, wishlist,
 * cart, theme toggle and account menu — roughly 20 stops — before
 * reaching page content, on every single page.
 *
 * Deliberately not `hidden`/`display:none`, which would remove it from
 * the tab order entirely and defeat the point.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
    >
      Skip to content
    </a>
  );
}
