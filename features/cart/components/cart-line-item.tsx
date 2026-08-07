"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { productIcons } from "@/features/shop/constants";
import { formatPrice } from "@/features/shop/utils";
import type { CartLine } from "../hooks";
import { removeFromCart, updateCartQuantity } from "../store";

export function CartLineItem({ line }: { line: CartLine }) {
  const Icon = productIcons[line.product.iconKey];
  const href = `/shop/product/${line.product.slug}`;

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={href}
        className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"
      >
        <Icon className="size-9 text-foreground/70" strokeWidth={1.25} aria-hidden />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={href} className="text-body-sm font-medium text-foreground hover:underline">
              {line.product.name}
            </Link>
            {line.variant && <p className="text-caption text-muted-foreground">Color: {line.variant}</p>}
          </div>
          <button
            type="button"
            aria-label={`Remove ${line.product.name} from cart`}
            onClick={() => removeFromCart(line.product.slug, line.variant)}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <QuantityStepper
            value={line.quantity}
            onChange={(quantity) => updateCartQuantity(line.product.slug, quantity, line.variant)}
          />
          <span className="text-body-sm font-semibold text-foreground">{formatPrice(line.lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}
