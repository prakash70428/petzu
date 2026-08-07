import { AnimatedCounter } from "@/components/motion/animated-counter";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { stats } from "../constants";

export function Stats() {
  return (
    <Section spacing="sm" className="border-b border-border">
      <RevealGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <RevealItem key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              className="font-display text-display-lg text-foreground"
            />
            <p className="text-body-sm text-muted-foreground">{stat.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
