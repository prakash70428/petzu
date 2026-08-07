"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MegaNavItem } from "@/types";
import { cn } from "@/utils/cn";

/**
 * Desktop nav with hover/focus-revealed mega-menu dropdowns. A short close
 * delay (`scheduleClose`) is what lets the cursor travel from the trigger
 * down into the panel without the menu flickering shut in the gap between
 * them — without it, mega menus are notoriously fiddly to use.
 */
export function MegaMenu({ items }: { items: MegaNavItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function open(index: number) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenIndex(index);
  }

  function scheduleClose() {
    closeTimeout.current = setTimeout(() => setOpenIndex(null), 150);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav
      className="hidden items-center gap-1 md:flex"
      onMouseLeave={scheduleClose}
    >
      {items.map((item, index) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => open(index)}
        >
          {item.megaMenu ? (
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-body-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onFocus={() => open(index)}
              aria-expanded={openIndex === index}
            >
              {item.label}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200 ease-premium",
                  openIndex === index && "rotate-180",
                )}
              />
            </button>
          ) : (
            <Link
              href={item.href}
              className="rounded-md px-3 py-2 text-body-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onFocus={() => setOpenIndex(null)}
            >
              {item.label}
            </Link>
          )}

          <AnimatePresence>
            {item.megaMenu && openIndex === index && (
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onMouseEnter={() => open(index)}
                className="glass-strong absolute left-0 top-full z-50 mt-2 w-[38rem] rounded-2xl p-6 shadow-2xl"
              >
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    {item.megaMenu.map((column) => (
                      <div key={column.title} className="flex flex-col gap-3">
                        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                          {column.title}
                        </p>
                        <ul className="flex flex-col gap-1">
                          {column.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-body-sm text-foreground transition-colors hover:bg-accent"
                                >
                                  {Icon && <Icon className="size-4 text-primary" aria-hidden />}
                                  {link.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {item.featured && (
                    <Link
                      href={item.featured.href}
                      className="group flex flex-col justify-between rounded-xl bg-gradient-brand p-4 text-primary-foreground transition-transform duration-200 ease-premium hover:-translate-y-0.5"
                    >
                      <div>
                        <p className="text-body-sm font-semibold">{item.featured.label}</p>
                        <p className="mt-1 text-caption opacity-90">
                          {item.featured.description}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-caption font-medium">
                        Explore
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  )}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
}
