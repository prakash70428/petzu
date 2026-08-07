"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { dialogTransition, overlayTransition } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { Button } from "./button";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Rendered as a real Radix trigger — always mounted, unlike `children` (see Dialog for why). */
  trigger?: ReactNode;
  side?: "right" | "left";
  children: ReactNode;
  className?: string;
}

/**
 * A side-anchored variant of Dialog — same controlled Radix + Framer Motion
 * approach, just sliding in from an edge instead of scaling from center.
 * Powers the cart drawer and the mobile filters panel.
 */
export function Sheet({ open, onOpenChange, trigger, side = "right", children, className }: SheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount key="sheet-portal">
            <DialogPrimitive.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={overlayTransition}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <m.div
                className={cn(
                  "glass-strong fixed inset-y-0 z-50 flex w-full max-w-md flex-col shadow-2xl outline-none",
                  side === "right" ? "right-0" : "left-0",
                  className,
                )}
                initial={{ x: side === "right" ? "100%" : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: side === "right" ? "100%" : "-100%" }}
                transition={dialogTransition}
              >
                <DialogPrimitive.Close asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close panel"
                    className="absolute right-4 top-4 z-10"
                  >
                    <X />
                  </Button>
                </DialogPrimitive.Close>
                {children}
              </m.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1 border-b border-border px-6 py-5 pr-14", className)}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-heading-4 font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function SheetBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t border-border px-6 py-5", className)} {...props} />;
}
