"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { addToCart } from "@/features/cart/store";

export interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  productSlug: string;
  productName: string;
  quantity?: number;
  /** A selected product variant (e.g. color) — distinct from `variant`, which is the button's own visual style. */
  selectedVariant?: string;
  iconOnly?: boolean;
}

/** The brief icon-swap-to-checkmark confirms the add without a toast being the only signal. */
export function AddToCartButton({
  productSlug,
  productName,
  quantity = 1,
  selectedVariant,
  iconOnly = false,
  className,
  children,
  ...buttonProps
}: AddToCartButtonProps) {
  const [justAdded, setJustAdded] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
  }, []);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    addToCart(productSlug, quantity, selectedVariant);
    setJustAdded(true);
    toast({ title: "Added to cart", description: productName, variant: "success", duration: 2500 });
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    resetTimeout.current = setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-label={iconOnly ? `Add ${productName} to cart` : undefined}
      className={cn(
        "transition-transform duration-200 ease-premium",
        justAdded && "scale-105",
        className,
      )}
      {...buttonProps}
    >
      {justAdded ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
      {!iconOnly && (justAdded ? "Added" : (children ?? "Add to cart"))}
    </Button>
  );
}
