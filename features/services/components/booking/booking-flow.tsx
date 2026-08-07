"use client";

import { AnimatePresence, m } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockPets } from "../../constants";
import type { Pet, Provider, ProviderService } from "../../types";
import { BookingConfirmation } from "./booking-confirmation";
import { BookingStepper } from "./booking-stepper";
import { BookingSummary } from "./booking-summary";
import { Calendar } from "./calendar";
import { PetSelector } from "./pet-selector";
import { TimeSlotPicker } from "./time-slot-picker";

export interface BookingFlowProps {
  provider: Provider;
  service: ProviderService;
}

/**
 * Owns every piece of booking state locally (lifted, not a global store —
 * see SERVICES.md §5 for why that's the right call for a single, one-shot
 * flow) and hands it down to each step as plain props + callbacks.
 */
export function BookingFlow({ provider, service }: BookingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? null;

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function handleConfirm() {
    if (!selectedPet || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setTimeout(() => {
      // `pet` carries the *name*, not an id — pets added mid-flow are
      // ephemeral local state with no backend to persist or re-fetch them
      // by id from on the success page, so the display value travels
      // directly through the URL instead.
      const params = new URLSearchParams({
        service: service.id,
        pet: selectedPet.name,
        date: selectedDate.toISOString(),
        time: selectedTime,
      });
      router.push(`/services/providers/${provider.slug}/book/success?${params.toString()}`);
    }, 900);
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
                  onAddPet={(pet) => setPets((prev) => [...prev, pet])}
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
