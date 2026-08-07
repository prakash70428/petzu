"use client";

import { useCart } from "@/features/cart/hooks";
import { productIcons } from "@/features/shop/constants";
import { formatPrice } from "@/features/shop/utils";

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING = 99;
/** GST on most pet supplies in India is 18%. */
const TAX_RATE = 0.18;

export function OrderSummary() {
  const { lines, subtotal, itemCount } = useCart();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <div className="flex h-fit flex-col gap-4 rounded-2xl border border-border p-6">
      <h2 className="text-heading-4 font-semibold text-foreground">Order summary</h2>

      <div className="flex max-h-72 flex-col gap-3 overflow-y-auto">
        {lines.map((line) => {
          const Icon = productIcons[line.product.iconKey];
          return (
            <div key={`${line.product.id}-${line.variant ?? ""}`} className="flex items-center gap-3">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 via-primary/5 to-transparent">
                <Icon className="size-5 text-foreground/70" strokeWidth={1.25} aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                  {line.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="line-clamp-1 text-body-sm font-medium text-foreground">
                  {line.product.name}
                </p>
                {line.variant && <p className="text-caption text-muted-foreground">{line.variant}</p>}
              </div>
              <span className="text-body-sm text-foreground">{formatPrice(line.lineTotal)}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4 text-body-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated tax</span>
          <span className="text-foreground">{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between border-t border-border pt-4 text-body-lg font-semibold text-foreground">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
