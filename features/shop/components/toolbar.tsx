"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FilterState, SortOption } from "../types";
import { FiltersPanel } from "./filters-panel";
import { SortSelect } from "./sort-select";

export interface ToolbarProps {
  resultCount: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

/** Result count + sort (always) + a mobile-only Filters trigger (the desktop sidebar renders separately). */
export function Toolbar({ resultCount, filters, onFiltersChange, sort, onSortChange }: ToolbarProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <p className="text-body-sm text-muted-foreground">
        <span className="font-medium text-foreground">{resultCount}</span>{" "}
        {resultCount === 1 ? "product" : "products"}
      </p>

      <div className="flex items-center gap-2">
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
            <FiltersPanel filters={filters} onChange={onFiltersChange} />
          </SheetBody>
        </Sheet>

        <SortSelect value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
