import { Quote, Star } from "lucide-react";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { testimonials } from "../constants";

export function Testimonials() {
  return (
    <Section id="testimonials">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline">Testimonials</Badge>
        <h2 className="mt-4 font-display text-display-lg text-foreground">
          Pet parents say it best
        </h2>
      </div>

      <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial) => (
          <RevealItem key={testimonial.name}>
            <Card interactive className="flex h-full flex-col gap-4 p-card-lg">
              <Quote className="size-6 text-primary/40" aria-hidden />
              <p className="flex-1 text-body-sm text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < testimonial.rating
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <Avatar size="sm">
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-caption text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
