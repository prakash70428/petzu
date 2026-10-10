export type MessagePart =
  | { type: "text"; value: string }
  | { type: "internal"; value: string }
  | { type: "external"; value: string };

// A full http(s) URL, or a site path like /services/vet-booking or /shop?pet=cats
// that starts a word (so "and/or" or "24/7" never become links).
const LINK_PATTERN = /(https?:\/\/[^\s)]+)|((?:^|(?<=[\s(]))\/[a-z0-9\-/]*(?:\?[a-z0-9=&\-]+)?)/gi;

/**
 * Splits an assistant message into plain text and links, so site paths the
 * bot mentions ("book at /services/vet-booking") become clickable. Trailing
 * sentence punctuation stays outside the link.
 */
export function splitMessageLinks(content: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(LINK_PATTERN)) {
    let value = match[0];
    const trailing = value.match(/[.,;:!?]+$/)?.[0] ?? "";
    value = value.slice(0, value.length - trailing.length);
    if (!value || (value === "/" && trailing)) continue;

    const start = match.index ?? 0;
    if (start > lastIndex) parts.push({ type: "text", value: content.slice(lastIndex, start) });
    parts.push({ type: value.startsWith("/") ? "internal" : "external", value });
    lastIndex = start + value.length;
  }

  if (lastIndex < content.length) parts.push({ type: "text", value: content.slice(lastIndex) });
  return parts;
}
