import { MapPin } from "lucide-react";
import Link from "next/link";
import type { Provider } from "../types";
import { pseudoRandom } from "../utils";

/**
 * An honest placeholder, not a fake embedded map — no real map provider is
 * wired up (frontend-only milestone), so this says exactly what it is
 * rather than pretending to be Google/Mapbox. Pins are real links to each
 * provider's page, positioned deterministically so the layout doesn't
 * reshuffle on every render.
 */
export function MapPlaceholder({ providers }: { providers: Provider[] }) {
  return (
    <div
      className="relative h-[28rem] w-full overflow-hidden rounded-2xl border border-border bg-secondary/40 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px]"
      role="img"
      aria-label={`Illustrative map showing ${providers.length} providers`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70" />
      <p className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-caption text-muted-foreground">
        Illustrative map — not to scale
      </p>

      {providers.map((provider) => {
        const top = 15 + pseudoRandom(`${provider.id}-top`) * 65;
        const left = 10 + pseudoRandom(`${provider.id}-left`) * 80;
        return (
          <Link
            key={provider.id}
            href={`/services/providers/${provider.slug}`}
            title={provider.name}
            style={{ top: `${top}%`, left: `${left}%` }}
            className="group absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
          >
            <span className="glass-strong mb-1 rounded-full px-2.5 py-1 text-caption font-medium text-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
              {provider.name}
            </span>
            <MapPin
              className="size-7 text-primary drop-shadow-md transition-transform duration-200 ease-premium group-hover:scale-125"
              fill="currentColor"
              aria-hidden
            />
          </Link>
        );
      })}
    </div>
  );
}
