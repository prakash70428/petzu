"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/features/shop/utils";
import { useCart } from "../hooks";
import { CartLineItem } from "./cart-line-item";

export interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { lines, subtotal } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader>
        <SheetTitle>Your cart{lines.length > 0 && ` (${lines.length})`}</SheetTitle>
      </SheetHeader>

      <SheetBody>
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium text-foreground">Your cart is empty</p>
              <p className="mt-1 text-body-sm text-muted-foreground">Add something your pet will love.</p>
            </div>
            <Button variant="outline" asChild onClick={() => onOpenChange(false)}>
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {lines.map((line) => (
              <CartLineItem key={`${line.product.id}-${line.variant ?? ""}`} line={line} />
            ))}
          </div>
        )}
      </SheetBody>

      {lines.length > 0 && (
        <SheetFooter className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <p className="text-caption text-muted-foreground">
            Shipping and taxes calculated at checkout.
          </p>
          <Button asChild size="lg" onClick={() => onOpenChange(false)}>
            <Link href="/checkout">Checkout</Link>
          </Button>
          <Button variant="ghost" asChild onClick={() => onOpenChange(false)}>
            <Link href="/cart">View full cart</Link>
          </Button>
        </SheetFooter>
      )}
    </Sheet>
  );
}
