import { siteConfig } from "@/constants/site";

/**
 * A wa.me click-to-chat link to PetZu's WhatsApp, with an optional message
 * already typed in. Null when no number is configured, so callers can hide
 * the link instead of showing a dead one.
 */
export function whatsappLink(text?: string): string | null {
  if (!siteConfig.whatsappNumber) return null;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${siteConfig.whatsappNumber}${query}`;
}
