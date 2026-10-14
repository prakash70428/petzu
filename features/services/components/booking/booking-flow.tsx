"use client";

import { AnimatePresence, m } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/store";
import { setChatGuest, useChatGuest } from "@/features/chatbot/guest-store";
import { bookingEnquirySchema } from "@/features/enquiries/schema";
import { submitEnquiry } from "@/features/enquiries/submit";
import { addAppointment } from "@/features/health/store";
import type { AppointmentKind } from "@/features/health/types";
import { addPet, usePetProfileState } from "@/features/pet-profile/store";
import type { PetProfile } from "@/features/pet-profile/types";
import type { Pet, Provider, ProviderService } from "../../types";
import { applyTimeToDate, formatDateLong, generateBookingReference } from "../../utils";
import { BookingConfirmation, type BookingContact } from "./booking-confirmation";
import { BookingStepper } from "./booking-stepper";
import { BookingSummary } from "./booking-summary";
import { Calendar } from "./calendar";
import { PetSelector } from "./pet-selector";
import { TimeSlotPicker } from "./time-slot-picker";

const SPECIES_LABEL: Record<PetProfile["species"], Pet["species"]> = {
  dogs: "Dog",
  cats: "Cat",
  birds: "Bird",
  fish: "Fish",
};

function toBookingPet(pet: PetProfile): Pet {
  return {
    id: pet.id,
    name: pet.name,
    species: SPECIES_LABEL[pet.species],
    breed: pet.breed,
    initials: pet.name.slice(0, 2).toUpperCase(),
  };
}

export interface BookingFlowProps {
  provider: Provider;
  service: ProviderService;
}

/**
 * Owns every piece of booking state locally (lifted, not a global store —
 * see SERVICES.md §5 for why that's the right call for a single, one-shot
 * flow) and hands it down to each step as plain props + callbacks.
 *
 * Pets are the owner's saved pet profiles. Confirming sends the request to
 * the PetZu team (who confirm it with the provider by email) and saves the
 * appointment to the pet's health records, which drives its reminders.
 */
export function BookingFlow({ provider, service }: BookingFlowProps) {
  const router = useRouter();
  const profile = usePetProfileState();
  const session = useSession();
  const guest = useChatGuest();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [contactInput, setContactInput] = useState<BookingContact>({ name: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const knownContact = session.user ?? guest;
  const contact = knownContact ? { name: knownContact.name, email: knownContact.email } : contactInput;
  const pets = profile.pets.map(toBookingPet);
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? null;

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  async function handleConfirm() {
    if (!selectedPet || !selectedDate || !selectedTime) return;
    const reference = generateBookingReference();
    const request = bookingEnquirySchema.safeParse({
      kind: "BOOKING",
      name: contact.name,
      email: contact.email,
      reference,
      provider: provider.name,
      service: service.name,
      when: `${formatDateLong(selectedDate)}, ${selectedTime}`,
      message: [
        `${service.name} with ${provider.name} (${provider.clinicName})`,
        `${formatDateLong(selectedDate)} at ${selectedTime}`,
        `Pet: ${selectedPet.name} (${selectedPet.species}, ${selectedPet.breed})`,
        notes.trim() && `Notes: ${notes.trim()}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    if (!request.success) {
      setError(request.error.issues[0]?.message ?? "Add your name and email");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await submitEnquiry(request.data);
    } catch {
      setError("We couldn't send your booking request. Please try again in a moment.");
      setSubmitting(false);
      return;
    }
    if (!knownContact) setChatGuest({ name: contact.name.trim(), email: contact.email.trim() });

    addAppointment({
      petId: selectedPet.id,
      petName: selectedPet.name,
      kind: provider.type as AppointmentKind,
      providerName: provider.name,
      service: service.name,
      startsAt: applyTimeToDate(selectedDate, selectedTime).toISOString(),
      notes: notes.trim(),
      reference,
    });

    const params = new URLSearchParams({
      service: service.id,
      pet: selectedPet.name,
      date: selectedDate.toISOString(),
      time: selectedTime,
      ref: reference,
      email: contact.email.trim(),
    });
    router.push(`/services/providers/${provider.slug}/book/success?${params.toString()}`);
  }

  const canContinueFromPet = selectedPetId !== null;
  const canContinueFromDateTime = selectedDate !== null && selectedTime !== null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-8">
        <BookingStepper currentStep={step} onStepClick={goTo} />

        <div className="relative min-h-[22rem] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <m.div
              key={step}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 0 && (
                <PetSelector
                  pets={pets}
                  selectedPetId={selectedPetId}
                  onSelect={setSelectedPetId}
                  onAddPet={(name) =>
                    addPet({ name, species: profile.browsingSpecies, breed: "Mixed / not sure" }).id
                  }
                />
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Calendar
                    providerId={provider.id}
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                  />
                  {selectedDate ? (
                    <TimeSlotPicker
                      providerId={provider.id}
                      date={selectedDate}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                    />
                  ) : (
                    <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-body-sm text-muted-foreground">
                      Pick a date to see available times.
                    </div>
                  )}
                </div>
              )}

              {step === 2 && selectedPet && selectedDate && selectedTime && (
                <BookingConfirmation
                  provider={provider}
                  service={service}
                  pet={selectedPet}
                  date={selectedDate}
                  time={selectedTime}
                  notes={notes}
                  onNotesChange={setNotes}
                  contact={contact}
                  onContactChange={setContactInput}
                  contactKnown={Boolean(knownContact)}
                  error={error}
                  submitting={submitting}
                  onConfirm={handleConfirm}
                />
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {step < 2 && (
          <div className="flex items-center justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => goTo(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button
              size="lg"
              onClick={() => goTo(step + 1)}
              disabled={step === 0 ? !canContinueFromPet : !canContinueFromDateTime}
            >
              Continue
            </Button>
          </div>
        )}
      </div>

      <BookingSummary provider={provider} service={service} pet={selectedPet} date={selectedDate} time={selectedTime} />
    </div>
  );
}
