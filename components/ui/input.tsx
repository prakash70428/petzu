import { cva, type VariantProps } from "class-variance-authority";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const inputVariants = cva(
  "flex w-full rounded-md border bg-card px-3 text-body-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 ease-premium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-body-sm file:font-medium",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        error:
          "border-destructive focus-visible:border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30",
      },
      inputSize: {
        sm: "h-8 text-caption",
        md: "h-10",
        lg: "h-12 text-body-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

export function Input({ className, variant, inputSize, ...props }: InputProps) {
  return (
    <input
      className={cn(inputVariants({ variant, inputSize }), className)}
      {...props}
    />
  );
}
