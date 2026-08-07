"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/utils/cn";
import { EMPTY_FILTERS, type FilterState } from "../types";

export interface ProviderFiltersProps {
  availableSpecialties: string[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ProviderFilters({ availableSpecialties, filters, onChange }: ProviderFiltersProps) {
  const hasActiveFilters =
    filters.specialties.length > 0 || filters.minRating !== null || filters.availableOnly;

  function toggleSpecialty(specialty: string) {
    const next = filters.specialties.includes(specialty)
      ? filters.specialties.filter((item) => item !== specialty)
      : [...filters.specialties, specialty];
    onChange({ ...filters, specialties: next });
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

      <div className="flex flex-col gap-3 border-b border-border pb-6">
        <h3 className="text-body-sm font-semibold text-foreground">Specialty</h3>
        {availableSpecialties.map((specialty) => (
          <div key={specialty} className="flex items-center gap-2.5">
            <Checkbox
              id={`specialty-${specialty}`}
              checked={filters.specialties.includes(specialty)}
              onCheckedChange={() => toggleSpecialty(specialty)}
            />
            <Label htmlFor={`specialty-${specialty}`} className="cursor-pointer font-normal text-muted-foreground">
              {specialty}
            </Label>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-b border-border pb-6">
        <h3 className="text-body-sm font-semibold text-foreground">Rating</h3>
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
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="accepting"
          checked={filters.availableOnly}
          onCheckedChange={(checked) => onChange({ ...filters, availableOnly: checked === true })}
        />
        <Label htmlFor="accepting" className="cursor-pointer font-normal text-muted-foreground">
          Accepting new patients
        </Label>
      </div>
    </div>
  );
}
