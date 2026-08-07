"use client";

import { useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { cn } from "@/utils/cn";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

/** Six boxes that behave like one field — type-to-advance, backspace-to-retreat, and paste-the-whole-code support. */
export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, char: string) {
    const digit = char.replace(/[^0-9]/g, "").slice(-1);
    const chars = value.split("");
    chars[index] = digit;
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    onChange(pasted);
    const lastIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[lastIndex]?.focus();
  }

  return (
    <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] ?? ""}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={cn(
            "size-12 rounded-lg border border-input bg-card text-center text-heading-4 font-semibold text-foreground outline-none transition-colors duration-150 ease-premium focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
          )}
        />
      ))}
    </div>
  );
}
