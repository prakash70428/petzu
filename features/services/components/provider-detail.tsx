import { BadgeCheck, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import type { Provider } from "../types";
import { formatPrice } from "../utils";

export function ProviderDetail({ provider }: { provider: Provider }) {
  const startingPrice = Math.min(...provider.services.map((service) => service.price));

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Avatar size="xl">
            <AvatarFallback>{provider.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-heading-1 font-semibold text-foreground">{provider.name}</h1>
              {provider.verified && (
                <BadgeCheck className="size-5 text-info" aria-label="Verified provider" />
              )}
            </div>
            <p className="mt-1 text-body-lg text-muted-foreground">{provider.title}</p>
            <p className="text-body-sm text-muted-foreground">{provider.clinicName}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <Rating value={provider.rating} showValue reviewCount={provider.reviewCount} size="md" />
              <span className="flex items-center gap-1 text-caption text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden />
                {provider.location.distanceMiles === 0
                  ? "Comes to you"
                  : `${provider.location.city}, ${provider.location.state} · ${provider.location.distanceMiles} mi`}
              </span>
              <span className="flex items-center gap-1 text-caption text-muted-foreground">
                <Globe2 className="size-3.5" aria-hidden />
                {provider.languages.join(", ")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-body-sm text-muted-foreground">{provider.bio}</p>

        <div className="flex flex-wrap gap-2">
          {provider.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>

        <div>
          <h2 className="text-heading-4 font-semibold text-foreground">Services &amp; pricing</h2>
          <div className="mt-4 flex flex-col gap-3">
            {provider.services.map((service) => (
              <Card key={service.id} className="flex items-center justify-between p-card">
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-caption text-muted-foreground">{service.durationMinutes} min</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-foreground">{formatPrice(service.price)}</span>
                  {provider.acceptsNewPatients ? (
                    <Button asChild size="sm">
                      <Link href={`/services/providers/${provider.slug}/book?service=${service.id}`}>
                        Book
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Waitlist
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-border p-6">
        <p className="text-caption text-muted-foreground">Starting from</p>
        <p className="text-heading-2 font-semibold text-foreground">{formatPrice(startingPrice)}</p>
        <p className="mt-2 text-body-sm text-muted-foreground">
          {provider.acceptsNewPatients
            ? "Currently accepting new patients."
            : "Not currently accepting new patients — waitlist only."}
        </p>
        {provider.acceptsNewPatients ? (
          <Button asChild size="lg" variant="gradient" className="mt-6 w-full">
            <Link href={`/services/providers/${provider.slug}/book`}>Book an appointment</Link>
          </Button>
        ) : (
          <Button size="lg" variant="outline" className="mt-6 w-full" disabled>
            Waitlist only
          </Button>
        )}
      </aside>
    </div>
  );
}
