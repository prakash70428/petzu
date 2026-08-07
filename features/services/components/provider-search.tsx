"use client";

import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type KeyboardEvent } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "@/components/ui/search";
import { cn } from "@/utils/cn";
import type { Provider } from "../types";

export interface ProviderSearchProps {
  providers: Provider[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MAX_SUGGESTIONS = 4;

/**
 * "Premium search" here means: results narrow live as you type (no submit
 * button), a preview dropdown shows the top matches before you've
 * committed to a full search, and it's fully keyboard-navigable — the
 * baseline modern users expect from any first-party search box.
 */
export function ProviderSearch({ providers, value, onChange, placeholder }: ProviderSearchProps) {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return providers
      .filter((provider) =>
        `${provider.name} ${provider.clinicName} ${provider.specialties.join(" ")}`
          .toLowerCase()
          .includes(query),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [providers, value]);

  const showSuggestions = focused && suggestions.length > 0;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const target = suggestions[highlightedIndex];
      if (target) {
        event.preventDefault();
        router.push(`/services/providers/${target.slug}`);
      }
    } else if (event.key === "Escape") {
      setFocused(false);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <SearchInput
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setHighlightedIndex(0);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        onKeyDown={handleKeyDown}
        onClear={() => onChange("")}
        placeholder={placeholder ?? "Search by name, clinic, or specialty…"}
        aria-label="Search providers"
        aria-expanded={showSuggestions}
        role="combobox"
      />

      <AnimatePresence>
        {showSuggestions && (
          <m.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="glass-strong absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl p-1.5 shadow-2xl"
          >
            {suggestions.map((provider, index) => (
              <Link
                key={provider.id}
                href={`/services/providers/${provider.slug}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  index === highlightedIndex ? "bg-accent" : "hover:bg-accent",
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <Avatar size="sm">
                  <AvatarFallback>{provider.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-foreground">{provider.name}</p>
                  <p className="truncate text-caption text-muted-foreground">
                    {provider.specialties[0]} · {provider.clinicName}
                  </p>
                </div>
              </Link>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
