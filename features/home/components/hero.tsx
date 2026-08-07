"use client";

import { m, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Heart, PawPrint, ShieldCheck, Star, Truck } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { FloatingBackground } from "@/components/motion/floating-background";
import { Magnetic } from "@/components/motion/magnetic";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";

const avatarInitials = ["SM", "JR", "PK", "DF"];

/**
 * The floating illustration is deliberately abstract — layered glass cards
 * and a central icon orb, not a literal pet photo — because a stock/AI pet
 * photo would read as generic or fake next to hand-crafted UI. This is the
 * same move Stripe/Linear/Framer make on their own marketing pages: the
 * "product visual" is built from the design system itself.
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
    <CursorGlow as="section" className="relative overflow-hidden border-b border-border">
      <FloatingBackground intensity="vivid" />

      <Container className="grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-16 py-20 lg:grid-cols-2 lg:py-0">
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

          <h1 className="font-display text-display-xl leading-[1.05] text-foreground sm:text-display-2xl">
            Everything your pet needs,{" "}
            <span className="text-gradient-brand">delivered with care.</span>
          </h1>

          <p className="max-w-lg text-body-lg text-muted-foreground">
            Vetted products, licensed vets, and a community of pet parents —
            all in one place. Same-day delivery in 85+ cities.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <Button asChild variant="gradient" size="lg" className="group w-full sm:w-auto">
                <Link href="/shop">
                  Start shopping
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button asChild variant="glass" size="lg" className="w-full sm:w-auto">
                <Link href="/services/vet-booking">Book a vet visit</Link>
              </Button>
            </Magnetic>
          </div>

          <div className="mt-2 flex items-center gap-3">
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
          </div>
        </m.div>

        <m.div
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative mx-auto hidden aspect-square w-full max-w-lg items-center justify-center lg:flex"
        >
          <m.div
            aria-hidden
            style={{ x: ringX, y: ringY }}
            className="absolute inset-8 rounded-full border border-dashed border-border/70"
          />

          <m.div
            style={{ x: nearX, y: nearY }}
            className="glass-strong flex size-64 items-center justify-center rounded-full shadow-glow"
          >
            <PawPrint className="size-24 text-primary" strokeWidth={1.5} aria-hidden />
          </m.div>

          <m.div
            style={{ x: farX, y: farY }}
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
            className="glass absolute bottom-10 right-0 flex animate-float items-center gap-2 rounded-2xl px-4 py-3 shadow-xl [animation-delay:1s]"
          >
            <Truck className="size-5 text-info" aria-hidden />
            <div>
              <p className="text-body-sm font-semibold text-foreground">Same-day delivery</p>
              <p className="text-caption text-muted-foreground">85+ cities</p>
            </div>
          </m.div>

          <m.div
            style={{ x: midX, y: farY }}
            className="glass absolute -right-4 top-1/3 flex animate-float items-center gap-2 rounded-2xl px-4 py-3 shadow-xl [animation-delay:2s]"
          >
            <Heart className="size-5 text-destructive" aria-hidden />
            <div className="flex items-center gap-1">
              <p className="text-heading-4 font-semibold text-foreground">4.9</p>
              <Star className="size-3.5 fill-warning text-warning" aria-hidden />
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
