import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ServiceStages } from "./service-stages";

export function Services() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline">Services</Badge>
        <h2 className="mt-4 font-display text-display-lg text-foreground">
          Care for every stage of their life
        </h2>
        <p className="mt-4 text-body-lg text-muted-foreground">
          From the day they come home to the day you say goodbye.
        </p>
      </div>

      <ServiceStages className="mt-14" />
    </Section>
  );
}
