"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { dialogTransition, overlayTransition } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { Button } from "./button";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Rendered as a real Radix trigger — always mounted, unlike `children`, which only exists in the DOM while `open` is true. */
  trigger?: ReactNode;
  children: ReactNode;
}

/**
 * Controlled by design: the caller owns `open` state, which is what lets
 * AnimatePresence know when to play the exit animation before Radix
 * actually unmounts the content (Radix's `forceMount` + our own
 * `{open && ...}` gate is what makes exit animations possible at all).
 *
 * `trigger` is a separate prop rather than a `children` element: `children`
 * only renders while `open` is true (that's what makes the exit animation
 * possible), so a trigger button placed there would never mount — nothing
 * would exist to open the dialog in the first place.
 */
export function Dialog({ open, onOpenChange, trigger, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount key="dialog-portal">
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
                className="glass-strong fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl p-card-lg shadow-2xl outline-none"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={dialogTransition}
              >
                <DialogPrimitive.Close asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close dialog"
                    className="absolute right-4 top-4"
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

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-heading-3 font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}
