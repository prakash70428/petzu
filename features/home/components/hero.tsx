"use client";

import { m, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Heart, ShieldCheck, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { FloatingBackground } from "@/components/motion/floating-background";
import { Magnetic } from "@/components/motion/magnetic";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { PetPicker } from "./pet-picker";

const avatarInitials = ["SM", "JR", "PK", "DF"];

/**
 * The hero photo is the first thing on the page, so it's the LCP element —
 * loaded with `priority` (skips lazy-loading) and a `sizes` hint matching
 * its actual rendered width at each breakpoint, so the browser never
 * downloads a larger source than the layout needs.
 */
/**
 * `-mt-16 pt-16` pulls the section's own box up to the true top of the page
 * (behind the sticky navbar, which is `top-0` but stays in normal flow) and
 * pushes the content back down by the same amount — so the hero's gradient
 * background paints all the way to y=0 and shows through the transparent
 * navbar, instead of the navbar revealing a flat `<body>` background before
 * the hero technically begins. `min-h-[calc(100vh-4rem)]` on the Container
 * below only makes sense paired with this: it's sizing the *content* to fill
 * the viewport minus the navbar's height, while the section itself spans
 * the full viewport.
 */
export function Hero() {
  const { x, y, onPointerMove, onPointerLeave } = useMouseParallax();

  const farX = useTransform(x, (v) => v * 40);
  const farY = useTransform(y, (v) => v * 40);
  const midX = useTransform(x, (v) => v * 24);
  const midY = useTransform(y, (v) => v * 24);
  const nearX = useTransform(x, (v) => v * 12);
  const nearY = useTransform(y, (v) => v * 12);
  const ringX = useTransform(x, (v) => v * -16);
  const ringY = useTransform(y, (v) => v * -16);

  return (
    <CursorGlow as="section" className="relative -mt-16 overflow-hidden border-b border-border pt-16">
      <FloatingBackground intensity="vivid" />

      <Container className="grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-16 py-20 lg:grid-cols-2 lg:py-16">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-6"
        >
          <Badge variant="secondary" className="glass gap-1.5">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            Trusted by 128,000+ pet parents
          </Badge>

          <h1 className="font-display text-display-lg leading-[1.08] text-foreground sm:text-display-xl lg:text-display-2xl lg:leading-[1.05]">
            Your pet&apos;s whole world,{" "}
            <span className="text-gradient-brand">delivered with care.</span>
          </h1>

          <p className="max-w-lg text-body text-muted-foreground sm:text-body-lg">
            Everything for happier, healthier pets — trusted products,
            expert vet guidance and a community of pet parents. Delivered
            quickly across major cities.
          </p>

          <PetPicker />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            <Magnetic>
              <Button asChild variant="gradient" size="lg" className="group w-full sm:w-auto">
                <Link href="/shop">
                  Start shopping
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild variant="glass" size="lg" className="w-full sm:w-auto">
              <Link href="/services/vet-booking">Book a vet visit</Link>
            </Button>
          </div>

          <Link
            href="#testimonials"
            className="mt-2 flex items-center gap-3 rounded-lg transition-opacity hover:opacity-80"
          >
            <div className="flex -space-x-3">
              {avatarInitials.map((initials) => (
                <Avatar key={initials} size="sm" className="border-2 border-background">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-caption text-muted-foreground">
                Loved by pet parents everywhere
              </p>
            </div>
          </Link>
        </m.div>

        <m.div
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          initial={{ opacity: 0, scale: 1.45, filter: "blur(16px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative order-first mx-auto flex aspect-[705/1280] w-full max-w-xs items-center justify-center sm:max-w-sm lg:order-last lg:max-w-md"
        >
          <m.div
            aria-hidden
            style={{ x: ringX, y: ringY }}
            className="absolute -inset-3 rounded-[2.5rem] bg-primary/25 blur-2xl"
          />

          <m.div
            style={{ x: nearX, y: nearY }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="glass-strong relative size-full overflow-hidden rounded-[2rem] shadow-glow"
          >
            {/* A static photo needs its own motion to feel alive — this slow, continuous
                zoom (a "Ken Burns" pan) starts once the entrance settles, independent of
                the parent's one-time scale-in, so the two animations never fight. */}
            <m.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              <Image
                src="/images/petzucutedog.jpeg"
                alt="A happy golden retriever cared for through PetZu"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 85vw"
                className="object-cover"
              />
            </m.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          </m.div>

          <m.div
            style={{ x: farX, y: farY }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.9 }}
            className="glass absolute left-2 top-6 flex animate-float items-center gap-2 rounded-2xl px-4 py-3 shadow-xl"
          >
            <ShieldCheck className="size-5 text-success" aria-hidden />
            <div>
              <p className="text-body-sm font-semibold text-foreground">Vet verified</p>
              <p className="text-caption text-muted-foreground">Every product checked</p>
            </div>
          </m.div>

          <m.div
            style={{ x: midX, y: midY }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.05 }}
            className="glass absolute bottom-10 right-0 flex animate-float items-center gap-2 rounded-2xl px-4 py-3 shadow-xl [animation-delay:1s]"
          >
            <Truck className="size-5 text-info" aria-hidden />
            <div>
              <p className="text-body-sm font-semibold text-foreground">Fast delivery</p>
              <p className="text-caption text-muted-foreground">Across major cities</p>
            </div>
          </m.div>

          <m.div
            style={{ x: midX, y: farY }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.2 }}
            className="glass absolute right-1 top-1/3 flex animate-float items-center gap-2 rounded-2xl px-4 py-3 shadow-xl sm:-right-4 [animation-delay:2s]"
          >
            <Heart className="size-5 text-destructive" aria-hidden />
            <div>
              <p className="text-body-sm font-semibold text-foreground">Made with love</p>
              <p className="text-caption text-muted-foreground">Every pet, every time</p>
            </div>
          </m.div>
        </m.div>
      </Container>

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:flex"
      >
        <m.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-caption">Scroll to explore</span>
          <ChevronDown className="size-4" aria-hidden />
        </m.div>
      </m.div>
    </CursorGlow>
  );
}
