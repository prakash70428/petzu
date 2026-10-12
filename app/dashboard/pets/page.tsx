"use client";

import { Dog, Plus, Trash2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/features/dashboard/components";
import { PetOnboardingDialog } from "@/features/pet-profile/components";
import { OTHER_BREED, speciesConfig } from "@/features/pet-profile/constants";
import { removePet, updatePet, usePetProfileState } from "@/features/pet-profile/store";
import type { PetProfile } from "@/features/pet-profile/types";
import { formatPetAge, lifeStageLabel, lifeStageOf } from "@/features/pet-profile/utils";
import { toast } from "@/hooks/use-toast";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The same pet profiles that personalise the site, editable in one place. */
export default function SavedPetsPage() {
  const profile = usePetProfileState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const addButton = (
    <Button onClick={() => setDialogOpen(true)}>
      <Plus className="size-4" aria-hidden />
      Add a pet
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Saved pets"
        description="Your pets personalise PetZu, fill in bookings and keep their own health records."
        action={profile.pets.length > 0 ? addButton : undefined}
      />

      {profile.hydrated && profile.pets.length === 0 ? (
        <EmptyState
          icon={Dog}
          title="No pets saved yet"
          description="Add your pets so the site, bookings and reminders are about them."
          action={addButton}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {profile.pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

      <PetOnboardingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

function PetCard({ pet }: { pet: PetProfile }) {
  const config = speciesConfig[pet.species];
  const Icon = config.icon;
  const stage = lifeStageOf(pet);
  const age = pet.birthdayEstimated ? null : formatPetAge(pet.birthday);
  const family = pet.family ?? [];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addMember() {
    if (name.trim().length < 2 || !EMAIL.test(email.trim())) {
      setError("Add their name and a valid email");
      return;
    }
    if (family.some((member) => member.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("They're already in the family");
      return;
    }
    updatePet(pet.id, { family: [...family, { name: name.trim(), email: email.trim() }] });
    setName("");
    setEmail("");
    setError(null);
  }

  return (
    <Card className="flex flex-col gap-4 p-card-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-heading-4 font-semibold text-foreground">{pet.name}</p>
          <p className="text-caption text-muted-foreground">
            {pet.breed === OTHER_BREED ? config.singular : pet.breed}
            {age && ` · ${age}`}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              <Icon className="size-3" aria-hidden />
              {config.label}
            </Badge>
            {stage && <Badge variant="outline">{lifeStageLabel(stage, pet.species)}</Badge>}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Remove ${pet.name}`}
          onClick={() => {
            removePet(pet.id);
            toast({ title: "Pet removed", description: `${pet.name} was removed.` });
          }}
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id={`last-journey-${pet.id}`}
          checked={Boolean(pet.lastJourney)}
          onCheckedChange={(checked) => updatePet(pet.id, { lastJourney: checked === true })}
        />
        <Label htmlFor={`last-journey-${pet.id}`} className="cursor-pointer font-normal text-muted-foreground">
          {pet.name} is in their last journey
        </Label>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-body-sm font-medium text-foreground">Family</p>
        {family.length === 0 ? (
          <p className="mt-1 text-caption text-muted-foreground">Add the people who share {pet.name}&apos;s care.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1.5">
            {family.map((member) => (
              <li key={member.email} className="flex items-center justify-between text-body-sm">
                <span>
                  {member.name} <span className="text-muted-foreground">{member.email}</span>
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${member.name}`}
                  onClick={() => updatePet(pet.id, { family: family.filter((m) => m.email !== member.email) })}
                  className="rounded p-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input aria-label="Name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            aria-label="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMember()}
          />
          <Button variant="outline" onClick={addMember} className="shrink-0">
            <UserPlus className="size-4" aria-hidden />
            Add
          </Button>
        </div>
        {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
      </div>
    </Card>
  );
}
