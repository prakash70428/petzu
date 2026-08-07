"use client";

import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { megaNav } from "@/constants/site";
import { AccountMenu } from "@/features/auth/components";
import { MiniCart } from "@/features/cart/components";
import { WishlistNavLink } from "@/features/wishlist/components";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/utils/cn";
import { Container } from "./container";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { NavSearch } from "./nav-search";
import { ThemeToggle } from "./theme-toggle";

/** Sticky site navbar: elevates on scroll, mega menu on desktop, slide-down menu on mobile. */
export function Navbar() {
  const scrolled = useScrollPosition();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <MegaMenu items={megaNav} />

        <div className="hidden items-center gap-1 md:flex">
          <NavSearch />
          <WishlistNavLink />
          <MiniCart />
          <ThemeToggle />
          <AccountMenu />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <WishlistNavLink />
          <MiniCart />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <m.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <Container className="flex flex-col gap-4 py-6">
              {megaNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-body font-medium text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-body-sm text-muted-foreground">Account</span>
                <AccountMenu />
              </div>
              <Button asChild className="w-full">
                <Link href="/shop">Shop now</Link>
              </Button>
            </Container>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
