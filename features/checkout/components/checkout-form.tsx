"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useCart } from "@/features/cart/hooks";
import { clearCart } from "@/features/cart/store";
import { OrderSummary } from "./order-summary";

/**
 * There's no backend, so "placing an order" is a simulated delay (long
 * enough to read as real processing, short enough not to feel broken)
 * followed by clearing the cart and redirecting to the success page.
 */
export function CheckoutForm() {
  const router = useRouter();
  const { lines } = useCart();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      clearCart();
      router.push("/checkout/success");
    }, 900);
  }

  if (lines.length === 0 && !submitting) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
        <p className="font-medium text-foreground">Your cart is empty</p>
        <p className="text-body-sm text-muted-foreground">Add something before checking out.</p>
        <Button asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-heading-4 font-semibold text-foreground">Contact</h2>
          <FormField label="Email" htmlFor="email">
            <Input id="email" type="email" required placeholder="you@example.com" />
          </FormField>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-heading-4 font-semibold text-foreground">Shipping address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="First name" htmlFor="first-name">
              <Input id="first-name" required autoComplete="given-name" />
            </FormField>
            <FormField label="Last name" htmlFor="last-name">
              <Input id="last-name" required autoComplete="family-name" />
            </FormField>
          </div>
          <FormField label="Address" htmlFor="address">
            <Input id="address" required autoComplete="street-address" placeholder="123 Bark Avenue" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="City" htmlFor="city">
              <Input id="city" required autoComplete="address-level2" />
            </FormField>
            <FormField label="State" htmlFor="state">
              <Input id="state" required autoComplete="address-level1" />
            </FormField>
            <FormField label="ZIP code" htmlFor="zip">
              <Input id="zip" required autoComplete="postal-code" />
            </FormField>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-heading-4 font-semibold text-foreground">Payment</h2>
            <Lock className="size-3.5 text-muted-foreground" aria-hidden />
          </div>
          <p className="text-caption text-muted-foreground">
            Demo checkout — no real payment is processed.
          </p>
          <FormField label="Card number" htmlFor="card-number">
            <Input id="card-number" required inputMode="numeric" placeholder="4242 4242 4242 4242" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Expiry" htmlFor="expiry">
              <Input id="expiry" required placeholder="MM / YY" />
            </FormField>
            <FormField label="CVC" htmlFor="cvc">
              <Input id="cvc" required inputMode="numeric" placeholder="123" />
            </FormField>
          </div>
        </section>

        <Button
          type="submit"
          size="lg"
          variant="gradient"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? "Placing order..." : "Place order"}
        </Button>
      </div>

      <OrderSummary />
    </form>
  );
}
