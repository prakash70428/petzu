"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Pet, Provider, ProviderService } from "../../types";
import { formatDateLong, formatPrice } from "../../utils";

export interface BookingConfirmationProps {
  provider: Provider;
  service: ProviderService;
  pet: Pet;
  date: Date;
  time: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  submitting: boolean;
  onConfirm: () => void;
}

export function BookingConfirmation({
  provider,
  service,
  pet,
  date,
  time,
  notes,
  onNotesChange,
  submitting,
  onConfirm,
}: BookingConfirmationProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border p-5">
        <dl className="grid grid-cols-2 gap-y-3 text-body-sm">
          <dt className="text-muted-foreground">Provider</dt>
          <dd className="text-foreground">{provider.name}</dd>
          <dt className="text-muted-foreground">Service</dt>
          <dd className="text-foreground">{service.name}</dd>
          <dt className="text-muted-foreground">Pet</dt>
          <dd className="text-foreground">{pet.name}</dd>
          <dt className="text-muted-foreground">Date</dt>
          <dd className="text-foreground">{formatDateLong(date)}</dd>
          <dt className="text-muted-foreground">Time</dt>
          <dd className="text-foreground">{time}</dd>
          <dt className="text-muted-foreground">Price</dt>
          <dd className="text-foreground">{formatPrice(service.price)}</dd>
        </dl>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-body-sm font-medium text-foreground">
          Notes for {provider.name.split(" ")[0]}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Anything they should know before the appointment?"
          rows={3}
        />
      </div>

      <Button size="lg" variant="gradient" onClick={onConfirm} disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Confirming..." : "Confirm booking"}
      </Button>
    </div>
  );
}
