import { CalendarDays, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Pet, Provider, ProviderService } from "../../types";
import { formatDateLong, formatPrice } from "../../utils";

export interface BookingSummaryProps {
  provider: Provider;
  service: ProviderService;
  pet: Pet | null;
  date: Date | null;
  time: string | null;
}

/** Sticky recap that fills in progressively as each step is completed — mirrors the checkout OrderSummary pattern. */
export function BookingSummary({ provider, service, pet, date, time }: BookingSummaryProps) {
  return (
    <div className="flex h-fit flex-col gap-4 rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3">
        <Avatar size="md">
          <AvatarFallback>{provider.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{provider.name}</p>
          <p className="text-caption text-muted-foreground">{provider.clinicName}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4 text-body-sm">
        <span className="text-muted-foreground">{service.name}</span>
        <span className="text-foreground">{formatPrice(service.price)}</span>
      </div>
      <p className="text-caption text-muted-foreground">{service.durationMinutes} min</p>

      {pet && (
        <div className="flex items-center gap-2 border-t border-border pt-4 text-body-sm">
          <Avatar size="sm">
            <AvatarFallback>{pet.initials}</AvatarFallback>
          </Avatar>
          <span className="text-foreground">{pet.name}</span>
        </div>
      )}

      {date && (
        <div className="flex items-center gap-2 text-body-sm text-foreground">
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
          {formatDateLong(date)}
        </div>
      )}

      {time && (
        <div className="flex items-center gap-2 text-body-sm text-foreground">
          <Clock className="size-4 text-muted-foreground" aria-hidden />
          {time}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4 text-body-lg font-semibold text-foreground">
        <span>Total</span>
        <span>{formatPrice(service.price)}</span>
      </div>
    </div>
  );
}
