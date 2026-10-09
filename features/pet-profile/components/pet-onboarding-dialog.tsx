"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OTHER_BREED, speciesConfig, speciesList } from "../constants";
import { addPet } from "../store";
import type { Species } from "../types";
import { formatPetAge, todayIso } from "../utils";

export interface PetOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** First visit: the secondary action reads "Skip for now" and remembers the skip. */
  firstVisit?: boolean;
  onSkip?: () => void;
}

/**
 * Two short steps (which animal, then name/breed/birthday) instead of one
 * long form: picking the animal first lets the second step show that
 * animal's breed list, and gets a first-time visitor to a personalised
 * homepage in two clicks if they skip the optional fields.
 */
export function PetOnboardingDialog({ open, onOpenChange, firstVisit = false, onSkip }: PetOnboardingDialogProps) {
  const [species, setSpecies] = useState<Species | null>(null);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setSpecies(null);
    setName("");
    setBreed("");
    setBirthday("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      if (firstVisit) onSkip?.();
      reset();
    }
    onOpenChange(next);
  }

  function handleSave() {
    if (!species) return;
    if (!name.trim()) {
      setError("Give your pet a name");
      return;
    }
    addPet({ name, species, breed: breed || OTHER_BREED, birthday: birthday || undefined });
    reset();
    onOpenChange(false);
  }

  const config = species ? speciesConfig[species] : null;
  const age = formatPetAge(birthday);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!config ? (
        <>
          <DialogHeader>
            <DialogTitle>{firstVisit ? "Welcome to PetZu! Who are we caring for?" : "Add a pet"}</DialogTitle>
            <DialogDescription>
              Pick your animal and we&apos;ll tailor the site to them.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {speciesList.map((key) => {
              const item = speciesConfig[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSpecies(key)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border text-left outline-none transition-shadow duration-200 ease-premium hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 14rem, 45vw"
                    className="object-cover transition-transform duration-300 ease-premium group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-body font-semibold text-white">{item.label}</span>
                </button>
              );
            })}
          </div>
          {firstVisit && (
            <DialogFooter>
              <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                Skip for now
              </Button>
            </DialogFooter>
          )}
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Tell us about your {config.singular}</DialogTitle>
            <DialogDescription>Only the name is required. You can change this any time.</DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4">
            <FormField label="Name" htmlFor="onboarding-pet-name" error={error ?? undefined}>
              <Input
                id="onboarding-pet-name"
                value={name}
                autoFocus
                maxLength={40}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSave();
                }}
                variant={error ? "error" : "default"}
                placeholder="e.g. Bruno"
              />
            </FormField>
            <FormField label="Breed" htmlFor="onboarding-pet-breed" helperText="Optional">
              <Select value={breed} onValueChange={setBreed}>
                <SelectTrigger id="onboarding-pet-breed" className="w-full">
                  <SelectValue placeholder={`Choose a ${config.singular} breed`} />
                </SelectTrigger>
                <SelectContent>
                  {[...config.breeds, OTHER_BREED].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              label="Birthday"
              htmlFor="onboarding-pet-birthday"
              helperText={age ? `That makes them ${age.toLowerCase()} old.` : "Optional. A rough date is fine."}
            >
              <Input
                id="onboarding-pet-birthday"
                type="date"
                max={todayIso()}
                value={birthday}
                onChange={(event) => setBirthday(event.target.value)}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSpecies(null)}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              {name.trim() ? `Save ${name.trim()}` : "Save pet"}
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
}
