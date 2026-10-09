"use client";

import { LocateFixed, MapPin, Search } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildMapEmbedUrl, type Coords } from "../utils";

type Status = "idle" | "locating" | "located" | "error";

export interface NearbyMapProps {
  /** What to search Google Maps for, e.g. "veterinary clinic". */
  searchTerm: string;
  /** Plural noun for copy, e.g. "vet clinics". */
  label: string;
}

/**
 * Asks for the visitor's location ("Near me") or a typed area, then shows a
 * real Google map of matching places around it. The location is only used
 * to centre the map: it isn't stored or sent to PetZu.
 */
export function NearbyMap({ searchTerm, label }: NearbyMapProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords>();
  const [area, setArea] = useState("");
  const [submittedArea, setSubmittedArea] = useState<string>();

  function locate() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Your browser can't share a location. Enter your area instead.");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setSubmittedArea(undefined);
        setStatus("located");
      },
      (geoError) => {
        setStatus("error");
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location access is blocked. Allow it in your browser settings, or enter your area instead."
            : "We couldn't get your location. Enter your area instead.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }

  function handleAreaSubmit(event: FormEvent) {
    event.preventDefault();
    if (!area.trim()) return;
    setCoords(undefined);
    setSubmittedArea(area.trim());
    setStatus("located");
    setError(null);
  }

  const embedUrl = status === "located" ? buildMapEmbedUrl(searchTerm, { coords, area: submittedArea }, process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" aria-hidden />
          <p className="text-body-sm font-medium text-foreground">
            {embedUrl
              ? `Showing ${label} ${coords ? "near you" : `in ${submittedArea}`}`
              : `Find ${label} near you`}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            size="sm"
            variant={coords ? "outline" : "gradient"}
            onClick={locate}
            disabled={status === "locating"}
          >
            <LocateFixed className="size-4" aria-hidden />
            {status === "locating" ? "Locating..." : "Near me"}
          </Button>
          <form onSubmit={handleAreaSubmit} className="flex items-center gap-2">
            <Input
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="Or enter area / PIN code"
              aria-label="Area or PIN code"
              className="h-9 sm:w-56"
            />
            <Button type="submit" size="sm" variant="outline" aria-label="Search this area" disabled={!area.trim()}>
              <Search className="size-4" aria-hidden />
            </Button>
          </form>
        </div>
      </div>

      {error && <p className="px-4 pb-3 text-caption text-destructive">{error}</p>}

      {embedUrl ? (
        <iframe
          key={embedUrl}
          src={embedUrl}
          title={`Map of ${label} near you`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[24rem] w-full border-0 border-t border-border"
        />
      ) : (
        <div className="flex h-40 items-center justify-center border-t border-border bg-secondary/40 px-6 text-center text-body-sm text-muted-foreground">
          Tap &ldquo;Near me&rdquo; or enter your area to see {label} on the map. Your location is only used to
          centre the map.
        </div>
      )}
    </div>
  );
}
