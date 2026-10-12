"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EMPTY_FILTERS, type FilterState } from "../types";

export interface ProviderFiltersProps {
  availableSpecialties: string[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  /** Wording for the availability checkbox, e.g. "Accepting new patients" for vets. */
  availabilityLabel: string;
}

export function ProviderFilters({ availableSpecialties, filters, onChange, availabilityLabel }: ProviderFiltersProps) {
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

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="accepting"
          checked={filters.availableOnly}
          onCheckedChange={(checked) => onChange({ ...filters, availableOnly: checked === true })}
        />
        <Label htmlFor="accepting" className="cursor-pointer font-normal text-muted-foreground">
          {availabilityLabel}
        </Label>
      </div>
    </div>
  );
}
