import type { ReactNode } from "react";
import { Label } from "./label";
import { cn } from "@/utils/cn";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  className?: string;
  children: ReactNode;
}

/** Composes Label + control + helper/error text with consistent spacing. */
export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-stack-xs", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="text-caption text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-caption text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
