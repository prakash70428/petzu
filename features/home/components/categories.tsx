import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { categories } from "../constants";

export function Categories() {
  return (
    <Section className="bg-secondary/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Categories</Badge>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Shop by pet
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-body-sm font-medium text-primary transition-colors hover:underline"
        >
          Browse all categories
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <RevealGroup className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <RevealItem key={category.label}>
              <Link
                href={category.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-200 ease-premium hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-md transition-transform duration-200 ease-premium group-hover:scale-110">
                  <Icon className="size-7" aria-hidden />
                </div>
                <div>
                  <p className="font-medium text-foreground">{category.label}</p>
                  <p className="text-caption text-muted-foreground">{category.count}</p>
                </div>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
