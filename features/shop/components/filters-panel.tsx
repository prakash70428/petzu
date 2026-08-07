"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/utils/cn";
import { petTypeLabels, priceBuckets, productCategories } from "../constants";
import { EMPTY_FILTERS, type FilterState, type PetType } from "../types";

export interface FiltersPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-6 last:border-none last:pb-0">
      <h3 className="text-body-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function FilterRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: ReactNode;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="cursor-pointer font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}

/** Shared by the desktop sidebar and the mobile Sheet — one filtering UI, two containers. */
export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const hasActiveFilters =
    filters.petTypes.length > 0 ||
    filters.categories.length > 0 ||
    filters.priceBuckets.length > 0 ||
    filters.minRating !== null ||
    filters.inStockOnly;

  function togglePetType(petType: PetType) {
    const next = filters.petTypes.includes(petType)
      ? filters.petTypes.filter((item) => item !== petType)
      : [...filters.petTypes, petType];
    onChange({ ...filters, petTypes: next });
  }

  function toggleListValue(key: "categories" | "priceBuckets", value: string) {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-4 font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            Clear all
          </Button>
        )}
      </div>

      <FilterSection title="Pet type">
        {(Object.keys(petTypeLabels) as PetType[]).map((petType) => (
          <FilterRow
            key={petType}
            id={`pet-${petType}`}
            label={petTypeLabels[petType]}
            checked={filters.petTypes.includes(petType)}
            onCheckedChange={() => togglePetType(petType)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Category">
        {productCategories.map((category) => (
          <FilterRow
            key={category}
            id={`cat-${category}`}
            label={category}
            checked={filters.categories.includes(category)}
            onCheckedChange={() => toggleListValue("categories", category)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price">
        {priceBuckets.map((bucket) => (
          <FilterRow
            key={bucket.label}
            id={`price-${bucket.label}`}
            label={bucket.label}
            checked={filters.priceBuckets.includes(bucket.label)}
            onCheckedChange={() => toggleListValue("priceBuckets", bucket.label)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Rating">
        <div className="flex flex-col gap-2">
          {[4, 3].map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => onChange({ ...filters, minRating: filters.minRating === min ? null : min })}
              className={cn(
                "-m-1 flex items-center gap-2 rounded-md p-1 transition-colors",
                filters.minRating === min ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Rating value={min} />
              <span className="text-body-sm">&amp; up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="in-stock"
          checked={filters.inStockOnly}
          onCheckedChange={(checked) => onChange({ ...filters, inStockOnly: checked === true })}
        />
        <Label htmlFor="in-stock" className="cursor-pointer font-normal text-muted-foreground">
          In stock only
        </Label>
      </div>
    </div>
  );
}
