"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/shop/utils";
import { useCart } from "../hooks";
import { CartLineItem } from "./cart-line-item";

export function CartPageContent() {
  const { lines, subtotal, itemCount } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">Your cart is empty</p>
          <p className="mt-1 text-body-sm text-muted-foreground">Add something your pet will love.</p>
        </div>
        <Button asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border px-6">
        {lines.map((line) => (
          <CartLineItem key={`${line.product.id}-${line.variant ?? ""}`} line={line} />
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-border p-6">
        <h2 className="text-heading-4 font-semibold text-foreground">Order summary</h2>
        <div className="mt-4 flex flex-col gap-2 text-body-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">Calculated at checkout</span>
          </div>
        </div>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
      </div>
    </div>
  );
}
