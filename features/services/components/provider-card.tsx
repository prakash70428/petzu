import { BadgeCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import type { Provider } from "../types";
import { formatPrice } from "../utils";

const VISIBLE_SPECIALTIES = 2;

export interface ProviderCardProps {
  provider: Provider;
}

/**
 * The one reusable card behind both listing pages. Same "full-cover link
 * sits behind the interactive controls" pattern as the store's
 * `ProductCard` — see DESIGN_SYSTEM.md / STORE.md for why.
 */
export function ProviderCard({ provider }: ProviderCardProps) {
  const detailHref = `/services/providers/${provider.slug}`;
  const startingPrice = Math.min(...provider.services.map((service) => service.price));
  const extraSpecialties = provider.specialties.length - VISIBLE_SPECIALTIES;

  return (
    <Card variant="glass" interactive className="group relative flex h-full flex-col gap-4 p-card-lg">
      <Link href={detailHref} aria-label={provider.name} className="absolute inset-0 z-10" />

      <div className="relative z-0 flex items-start gap-3">
        <Avatar size="lg">
          <AvatarFallback>{provider.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-body font-semibold text-foreground">{provider.name}</h3>
            {provider.verified && (
              <BadgeCheck className="size-4 shrink-0 text-info" aria-label="Verified provider" />
            )}
          </div>
          <p className="text-caption text-muted-foreground">{provider.title}</p>
          <p className="text-caption text-muted-foreground">{provider.clinicName}</p>
        </div>
      </div>

      <Rating value={provider.rating} showValue reviewCount={provider.reviewCount} />

      <div className="flex flex-wrap gap-1.5">
        {provider.specialties.slice(0, VISIBLE_SPECIALTIES).map((specialty) => (
          <Badge key={specialty} variant="secondary">
            {specialty}
          </Badge>
        ))}
        {extraSpecialties > 0 && <Badge variant="outline">+{extraSpecialties} more</Badge>}
      </div>

      <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        {provider.location.distanceMiles === 0
          ? "Comes to you"
          : `${provider.location.city}, ${provider.location.state} · ${provider.location.distanceMiles} mi`}
      </div>

      <div className="relative z-20 mt-auto flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-caption text-muted-foreground">From</p>
          <p className="text-body font-semibold text-foreground">{formatPrice(startingPrice)}</p>
        </div>
        <Button asChild size="sm">
          <Link href={`${detailHref}/book`}>Book now</Link>
        </Button>
      </div>
    </Card>
  );
}
