import { CheckCircle2, Package, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/constants/seo";
import { scaleIn } from "@/constants/animations";
import { OrderNumber } from "@/features/checkout/components";

export const metadata: Metadata = buildMetadata({ title: "Order confirmed", path: "/checkout/success" });

export default function CheckoutSuccessPage() {
  return (
    <Section spacing="lg" className="flex flex-col items-center text-center">
      <Reveal variants={scaleIn}>
        <div className="glass-strong flex size-20 items-center justify-center rounded-full shadow-glow">
          <CheckCircle2 className="size-10 text-success" aria-hidden />
        </div>
      </Reveal>

      <h1 className="mt-6 font-display text-display-lg text-foreground">Order confirmed!</h1>
      <p className="mt-3 max-w-md text-body-lg text-muted-foreground">
        Thanks for shopping with PetZu. A confirmation email is on its way.
      </p>
      <p className="mt-2 text-body-sm text-muted-foreground">
        Order number <OrderNumber />
      </p>

      <div className="mt-10 grid w-full max-w-md grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4">
          <Package className="size-5 text-primary" aria-hidden />
          <p className="text-caption text-muted-foreground">Processing 1–2 days</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4">
          <Truck className="size-5 text-primary" aria-hidden />
          <p className="text-caption text-muted-foreground">Arrives in 3–5 days</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/shop">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Section>
  );
}
