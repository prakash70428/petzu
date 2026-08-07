"use client";

import { AnimatePresence, m } from "framer-motion";
import { dismissToast, useToasts } from "@/hooks/use-toast";
import { toastTransition } from "@/constants/motion";
import { Toast } from "./toast";

/**
 * Mounted once in AppProviders. Renders whatever `toast()` has pushed to
 * the module-level store, animated in/out with a spring (transient UI
 * reads better with physical motion than an eased tween).
 */
export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <m.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={toastTransition}
          >
            <Toast toast={item} onDismiss={dismissToast} />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
