import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { scaleIn } from "@/constants/animations";
import { buildMetadata } from "@/constants/seo";
import { AddToCalendarButton, BookingReference } from "@/features/services/components/booking";
import { providers } from "@/features/services/constants";
import { formatDateLong, getProviderBySlug } from "@/features/services/utils";

interface SuccessPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string; pet?: string; date?: string; time?: string }>;
}

export function generateStaticParams() {
  return providers.map((provider) => ({ slug: provider.slug }));
}

export const metadata: Metadata = buildMetadata({ title: "Appointment confirmed", path: "/services" });

export default async function BookingSuccessPage({ params, searchParams }: SuccessPageProps) {
  const { slug } = await params;
  const { service: serviceId, pet, date, time } = await searchParams;
  const provider = getProviderBySlug(slug);
  if (!provider) notFound();

  const service = provider.services.find((item) => item.id === serviceId) ?? provider.services[0];
  const parsedDate = date ? new Date(date) : null;

  return (
    <Section spacing="lg" className="flex flex-col items-center text-center">
      <Reveal variants={scaleIn}>
        <div className="glass-strong flex size-20 items-center justify-center rounded-full shadow-glow">
          <CheckCircle2 className="size-10 text-success" aria-hidden />
        </div>
      </Reveal>

      <h1 className="mt-6 font-display text-display-lg text-foreground">Appointment confirmed!</h1>
      <p className="mt-3 max-w-md text-body-lg text-muted-foreground">
        You&apos;re booked with {provider.name}. A confirmation email is on its way
        {pet ? ` for ${pet}` : ""}.
      </p>
      <p className="mt-2 text-body-sm text-muted-foreground">
        Booking reference <BookingReference />
      </p>

      <div className="mt-10 w-full max-w-sm rounded-2xl border border-border p-6 text-left">
        <dl className="flex flex-col gap-3 text-body-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Service</dt>
            <dd className="text-foreground">{service.name}</dd>
          </div>
          {pet && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Pet</dt>
              <dd className="text-foreground">{pet}</dd>
            </div>
          )}
          {parsedDate && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-foreground">{formatDateLong(parsedDate)}</dd>
            </div>
          )}
          {time && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Time</dt>
              <dd className="text-foreground">{time}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {parsedDate && time && (
          <AddToCalendarButton provider={provider} service={service} date={parsedDate} time={time} />
        )}
        <Button asChild size="lg" variant="outline">
          <Link href={`/services/providers/${provider.slug}`}>Back to profile</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Section>
  );
}
