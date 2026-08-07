import { CheckCircle2, Stethoscope, Video } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scaleIn } from "@/constants/animations";
import { vetBookingFeatures } from "../constants";

export function VetBooking() {
  return (
    <Section className="overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <Badge variant="outline">Vet booking</Badge>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            See a vet today, not next week.
          </h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Skip the waiting room. Book a licensed vet for a video or
            in-clinic visit in under two minutes.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {vetBookingFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-body-sm text-foreground"
              >
                <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Magnetic className="mt-8 inline-block">
            <Button asChild size="lg" variant="gradient">
              <Link href="/services/vet-booking">Book an appointment</Link>
            </Button>
          </Magnetic>
        </Reveal>

        <Reveal variants={scaleIn} className="relative mx-auto w-full max-w-md">
          <div className="glass-strong animate-float rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">Dr. Reyes</p>
                  <p className="text-caption text-muted-foreground">
                    Small animal vet · 4.9★
                  </p>
                </div>
              </div>
              <Badge variant="success">Confirmed</Badge>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <Video className="size-5 text-info" aria-hidden />
              <div>
                <p className="text-body-sm font-medium text-foreground">
                  Video consultation
                </p>
                <p className="text-caption text-muted-foreground">Today, 4:30 PM</p>
              </div>
            </div>
          </div>

          <div className="glass absolute -bottom-6 -left-6 flex animate-float items-center gap-2 rounded-2xl px-4 py-3 shadow-xl [animation-delay:1s]">
            <Stethoscope className="size-5 text-primary" aria-hidden />
            <div>
              <p className="text-body-sm font-semibold text-foreground">2,400+ vets</p>
              <p className="text-caption text-muted-foreground">Licensed & verified</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
