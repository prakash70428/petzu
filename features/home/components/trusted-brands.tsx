import { Container } from "@/components/layout/container";
import { Marquee } from "@/components/motion/marquee";

import { trustedBrands } from "../constants";

/** Full-bleed marquee — deliberately escapes the container so the logos
 * scroll edge-to-edge, while the heading above stays column-width. */
export function TrustedBrands() {
  return (
    <section className="border-b border-border py-section-sm">
      <Container>
        <p className="mb-8 text-center text-caption font-medium uppercase tracking-wide text-muted-foreground">
          Trusted by pet-care brands across the country
        </p>
      </Container>
      <Marquee>
        {trustedBrands.map((brand) => (
          <span
            key={brand}
            className="text-heading-4 font-display font-semibold text-muted-foreground/50 transition-colors hover:text-foreground"
          >
            {brand}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
