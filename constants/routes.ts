/**
 * Centralized route path constants. Import these instead of hardcoding
 * href strings so route renames only require a single edit.
 */
export const routes = {
  home: "/",
  shop: "/shop",
  community: "/community",
  about: "/about",
  contact: "/contact",
  pricing: "/pricing",
  careers: "/careers",
  privacy: "/privacy",
  terms: "/terms",
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

export type RouteKey = keyof typeof routes;
