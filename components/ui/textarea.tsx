import { cva, type VariantProps } from "class-variance-authority";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const textareaVariants = cva(
  "flex min-h-24 w-full rounded-md border bg-card px-3 py-2 text-body-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 ease-premium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        error:
          "border-destructive focus-visible:border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export function Textarea({ className, variant, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  );
}
