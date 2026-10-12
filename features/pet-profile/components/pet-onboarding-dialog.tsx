"use client";

import { ArrowLeft, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OTHER_BREED, speciesConfig, speciesList } from "../constants";
import { addPet } from "../store";
import type { FamilyMember, LifeStage, Species } from "../types";
import { estimatedBirthday, formatPetAge, lifeStageLabel, lifeStageOf, todayIso } from "../utils";

const STAGES: LifeStage[] = ["baby", "teen", "adult", "senior", "last-journey"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface PetOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** First visit: the secondary action reads "Skip for now" and remembers the skip. */
  firstVisit?: boolean;
  onSkip?: () => void;
}

/**
 * Short steps instead of one long form: which animal, then name, breed and
 * birthday (or, if nobody knows it, a life stage), then optionally who else
 * in the family looks after them. Picking the animal first lets the second
 * step show that animal's breed list; everything but the name is optional.
 */
export function PetOnboardingDialog({ open, onOpenChange, firstVisit = false, onSkip }: PetOnboardingDialogProps) {
  const [species, setSpecies] = useState<Species | null>(null);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState("");
  const [stage, setStage] = useState<LifeStage | null>(null);
  const [step, setStep] = useState<"details" | "family">("details");
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setSpecies(null);
    setName("");
    setBreed("");
    setBirthday("");
    setStage(null);
    setStep("details");
    setFamily([]);
    setMemberName("");
    setMemberEmail("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      if (firstVisit) onSkip?.();
      reset();
    }
    onOpenChange(next);
  }

  function handleNext() {
    if (!name.trim()) {
      setError("Give your pet a name");
      return;
    }
    setError(null);
    setStep("family");
  }

  function addMember() {
    if (memberName.trim().length < 2 || !EMAIL.test(memberEmail.trim())) {
      setError("Add their name and a valid email");
      return;
    }
    setFamily((prev) => [...prev, { name: memberName.trim(), email: memberEmail.trim() }]);
    setMemberName("");
    setMemberEmail("");
    setError(null);
  }

  function handleSave() {
    if (!species) return;
    const estimate = !birthday && stage && stage !== "last-journey" ? stage : null;
    addPet({
      name,
      species,
      breed: breed || OTHER_BREED,
      birthday: birthday || (estimate ? estimatedBirthday(species, estimate) : undefined),
      birthdayEstimated: Boolean(estimate),
      lastJourney: stage === "last-journey",
      family,
    });
    reset();
    onOpenChange(false);
  }

  const config = species ? { key: species, ...speciesConfig[species] } : null;
  const age = formatPetAge(birthday);
  const birthdayStage = species && birthday ? lifeStageOf({ species, birthday }) : null;

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
      ) : step === "family" ? (
        <>
          <DialogHeader>
            <DialogTitle>Who else looks after {name.trim()}?</DialogTitle>
            <DialogDescription>
              Optional. Add family members who share {name.trim()}&apos;s care, like a partner or parent.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4">
            {family.length > 0 && (
              <ul className="flex flex-col gap-2">
                {family.map((member) => (
                  <li
                    key={member.email}
                    className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-body-sm"
                  >
                    <span>
                      <span className="font-medium text-foreground">{member.name}</span>{" "}
                      <span className="text-muted-foreground">{member.email}</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${member.name}`}
                      onClick={() => setFamily((prev) => prev.filter((m) => m.email !== member.email))}
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                aria-label="Family member's name"
                placeholder="Name"
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
              />
              <Input
                aria-label="Family member's email"
                type="email"
                placeholder="Email"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addMember();
                }}
              />
            </div>
            {error && <p className="text-caption text-destructive">{error}</p>}
            <Button variant="outline" size="sm" onClick={addMember} className="self-start">
              <Plus className="size-4" aria-hidden />
              Add family member
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setStep("details")}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              {family.length > 0 ? `Save ${name.trim()}` : "Skip and save"}
            </Button>
          </DialogFooter>
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
                  if (event.key === "Enter") handleNext();
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
                onChange={(event) => {
                  setBirthday(event.target.value);
                  if (stage !== "last-journey") setStage(null);
                }}
              />
            </FormField>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-body-sm font-medium text-foreground">Life stage</legend>
              <p className="text-caption text-muted-foreground">
                {birthdayStage
                  ? `From the birthday: ${lifeStageLabel(birthdayStage, config.key)}. It updates by itself every year.`
                  : "No birthday? Pick the closest stage and we'll keep it up to date."}
              </p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((option) => {
                  const pressed = stage === option || (!stage && birthdayStage === option);
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => setStage(stage === option ? null : option)}
                      disabled={Boolean(birthday) && option !== "last-journey"}
                      className="rounded-full border border-border px-3 py-1.5 text-body-sm text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                    >
                      {lifeStageLabel(option, config.key)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSpecies(null)}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
            <Button variant="gradient" onClick={handleNext}>
              Next
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
}
