import { SearchX } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { Provider } from "../types";
import { ProviderCard } from "./provider-card";

export interface ProviderGridProps {
  providers: Provider[];
  onClearFilters?: () => void;
}

export function ProviderGrid({ providers, onClearFilters }: ProviderGridProps) {
  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
        <SearchX className="size-10 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">No providers match your search</p>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Try a different specialty or clearing your filters.
          </p>
        </div>
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {providers.map((provider) => (
        <RevealItem key={provider.id}>
          <ProviderCard provider={provider} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
