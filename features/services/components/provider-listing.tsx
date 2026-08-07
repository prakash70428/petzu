"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EMPTY_FILTERS, type FilterState, type Provider, type SortOption } from "../types";
import { filterProviders, sortProviders } from "../utils";
import { ProviderFilters } from "./provider-filters";
import { ProviderGrid } from "./provider-grid";
import { ProviderSearch } from "./provider-search";
import { ProviderToolbar } from "./provider-toolbar";

/**
 * Map view is opt-in — most visitors never toggle it, so its markup and
 * the pin-positioning maths shouldn't sit in the bundle everyone pays
 * for. `ssr: false` because it renders nothing meaningful server-side
 * (it's behind a client-only view toggle) and skipping SSR keeps it out
 * of the server payload too.
 */
const MapPlaceholder = dynamic(
  () => import("./map-placeholder").then((mod) => mod.MapPlaceholder),
  { ssr: false, loading: () => <Skeleton className="h-[28rem] w-full rounded-2xl" /> },
);

export interface ProviderListingProps {
  providers: Provider[];
  availableSpecialties: string[];
}

/** The interactive engine both the vet and groomer listing pages share — search, filters, sort, and list/map view, all client-only. */
export function ProviderListing({ providers, availableSpecialties }: ProviderListingProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [view, setView] = useState<"list" | "map">("list");

  const visibleProviders = useMemo(() => {
    return sortProviders(filterProviders(providers, filters, query), sort);
  }, [providers, filters, sort, query]);

  return (
    <div className="flex flex-col gap-6">
      <ProviderSearch providers={providers} value={query} onChange={setQuery} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <ProviderFilters
            availableSpecialties={availableSpecialties}
            filters={filters}
            onChange={setFilters}
          />
        </aside>

        <div className="flex flex-col gap-6">
          <ProviderToolbar
            resultCount={visibleProviders.length}
            availableSpecialties={availableSpecialties}
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
          />

          {view === "map" ? (
            <MapPlaceholder providers={visibleProviders} />
          ) : (
            <ProviderGrid
              providers={visibleProviders}
              onClearFilters={() => setFilters(EMPTY_FILTERS)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
