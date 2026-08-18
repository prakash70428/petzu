import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { cardVariants } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { services } from "../constants";

export function Services() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline">Services</Badge>
        <h2 className="mt-4 font-display text-display-lg text-foreground">
          Care that goes beyond the cart
        </h2>
        <p className="mt-4 text-body-lg text-muted-foreground">
          From same-day vet visits to grooming at your door, everything your
          pet needs, handled.
        </p>
      </div>

      <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <RevealItem key={service.title}>
              <Link
                href={service.href}
                className={cn(cardVariants({ interactive: true }), "group block h-full p-card-lg")}
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 ease-premium group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-heading-4 font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {service.description}
                </p>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
