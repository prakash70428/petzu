"use client";

import { List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetBody, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import { sortOptions } from "../constants";
import type { FilterState, SortOption } from "../types";
import { ProviderFilters } from "./provider-filters";

export interface ProviderToolbarProps {
  resultCount: number;
  availableSpecialties: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: "list" | "map";
  onViewChange: (view: "list" | "map") => void;
}

export function ProviderToolbar({
  resultCount,
  availableSpecialties,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: ProviderToolbarProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <p className="text-body-sm text-muted-foreground">
        <span className="font-medium text-foreground">{resultCount}</span>{" "}
        {resultCount === 1 ? "provider" : "providers"}
      </p>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1 rounded-md border border-border p-1 sm:flex">
          <button
            type="button"
            aria-pressed={view === "list"}
            aria-label="List view"
            onClick={() => onViewChange("list")}
            className={cn(
              "flex size-7 items-center justify-center rounded transition-colors",
              view === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            aria-pressed={view === "map"}
            aria-label="Map view"
            onClick={() => onViewChange("map")}
            className={cn(
              "flex size-7 items-center justify-center rounded transition-colors",
              view === "map" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MapIcon className="size-4" />
          </button>
        </div>

        <Sheet
          open={mobileFiltersOpen}
          onOpenChange={setMobileFiltersOpen}
          side="left"
          trigger={
            <Button variant="outline" size="sm" className="lg:hidden">
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
          }
        >
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <ProviderFilters
              availableSpecialties={availableSpecialties}
              filters={filters}
              onChange={onFiltersChange}
            />
          </SheetBody>
        </Sheet>

        <Select value={sort} onValueChange={(next) => onSortChange(next as SortOption)}>
          <SelectTrigger className="w-[11rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
