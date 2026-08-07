"use client";

import { Search as SearchIcon, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { inputVariants } from "./input";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  inputSize?: "sm" | "md" | "lg";
  /** Clears the value; omit to hide the clear button entirely. */
  onClear?: () => void;
  /** Keyboard-shortcut hint rendered on the right, e.g. "⌘K" (Stripe/Linear-style command trigger). */
  shortcut?: string;
}

export function SearchInput({
  className,
  inputSize = "md",
  onClear,
  shortcut,
  value,
  ...props
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={value}
        className={cn(
          inputVariants({ inputSize }),
          "pl-9",
          onClear && value ? "pr-9" : shortcut ? "pr-14" : "",
          "[&::-webkit-search-cancel-button]:appearance-none",
          className,
        )}
        {...props}
      />
      {onClear && value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : shortcut ? (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-caption text-muted-foreground">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
}
