"use client";

import { ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "../hooks";

/**
 * The drawer (Sheet + Radix Dialog + line-item editing) is deferred until
 * the cart is actually opened. This is the highest-leverage dynamic
 * import in the app: `MiniCart` renders in the navbar on *every* route,
 * so without this every page pays for drawer code most visits never use.
 */
const CartDrawer = dynamic(() => import("./cart-drawer").then((mod) => mod.CartDrawer), {
  ssr: false,
});

/**
 * The navbar's compact cart affordance — an icon plus a live item-count
 * badge. Distinct from `CartDrawer` itself: this is the always-visible
 * trigger; the drawer is the full editable panel it opens.
 */
export function MiniCart() {
  const [open, setOpen] = useState(false);
  /**
   * `dynamic()` alone would still fetch the chunk as soon as MiniCart
   * mounts, since the element is in the tree regardless of `open`. Gating
   * on "has it ever been opened" is what actually defers the download to
   * first use — and keeping it mounted afterwards (rather than
   * `{open && ...}`) preserves the Sheet's exit animation, which needs
   * the component to survive one render past `open` going false.
   */
  const [hasOpened, setHasOpened] = useState(false);
  const { itemCount } = useCart();

  function openCart() {
    setHasOpened(true);
    setOpen(true);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
        onClick={openCart}
      >
        <ShoppingBag className="size-5" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </Button>
      {hasOpened && <CartDrawer open={open} onOpenChange={setOpen} />}
    </>
  );
}
