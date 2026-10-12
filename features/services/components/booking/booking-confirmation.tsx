"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Pet, Provider, ProviderService } from "../../types";
import { formatDateLong, formatPrice } from "../../utils";

export interface BookingContact {
  name: string;
  email: string;
}

export interface BookingConfirmationProps {
  provider: Provider;
  service: ProviderService;
  pet: Pet;
  date: Date;
  time: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  contact: BookingContact;
  onContactChange: (contact: BookingContact) => void;
  /** Hide the contact fields when we already know who's booking (signed in or chatted before). */
  contactKnown: boolean;
  error: string | null;
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
  contact,
  onContactChange,
  contactKnown,
  error,
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
          Notes for {provider.name} <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Symptoms, recent changes, questions you want to ask"
          rows={3}
        />
      </div>

      {!contactKnown && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Your name" htmlFor="booking-name">
            <Input
              id="booking-name"
              autoComplete="name"
              value={contact.name}
              onChange={(event) => onContactChange({ ...contact, name: event.target.value })}
            />
          </FormField>
          <FormField label="Email" htmlFor="booking-email" helperText="We'll confirm the booking here.">
            <Input
              id="booking-email"
              type="email"
              autoComplete="email"
              value={contact.email}
              onChange={(event) => onContactChange({ ...contact, email: event.target.value })}
            />
          </FormField>
        </div>
      )}

      {error && <p className="text-body-sm text-destructive">{error}</p>}

      <Button size="lg" variant="gradient" onClick={onConfirm} disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending..." : "Request booking"}
      </Button>
    </div>
  );
}
