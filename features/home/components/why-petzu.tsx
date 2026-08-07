import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { whyPetzu } from "../constants";

export function WhyPetzu() {
  return (
    <Section className="bg-secondary/40">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline">Why PetZu</Badge>
        <h2 className="mt-4 font-display text-display-lg text-foreground">
          Built different, on purpose
        </h2>
      </div>

      <RevealGroup className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {whyPetzu.map((item) => {
          const Icon = item.icon;
          return (
            <RevealItem key={item.title} className="group flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm transition-all duration-200 ease-premium group-hover:-translate-y-1 group-hover:shadow-md">
                <Icon className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-body-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
