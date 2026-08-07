import { useEffect, useState } from "react";

/**
 * Reports whether the page has scrolled past `threshold` pixels.
 * Powers the navbar's scrolled/elevated visual state.
 */
export function useScrollPosition(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
