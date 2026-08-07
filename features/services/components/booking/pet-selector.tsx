"use client";

import { Plus } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import type { Pet } from "../../types";

export interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string | null;
  onSelect: (petId: string) => void;
  onAddPet: (pet: Pet) => void;
}

export function PetSelector({ pets, selectedPetId, onSelect, onAddPet }: PetSelectorProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const pet: Pet = {
      id: `pet-${Date.now()}`,
      name: trimmed,
      species: "Dog",
      breed: "Mixed breed",
      initials: trimmed.slice(0, 2).toUpperCase(),
    };
    onAddPet(pet);
    onSelect(pet.id);
    setName("");
    setAdding(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") handleAdd();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pets.map((pet) => {
          const selected = pet.id === selectedPetId;
          return (
            <button
              key={pet.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(pet.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-150 ease-premium",
                selected ? "border-primary bg-accent shadow-sm" : "border-border hover:border-primary/40",
              )}
            >
              <Avatar size="md">
                <AvatarFallback>{pet.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-body-sm font-medium text-foreground">{pet.name}</p>
                <p className="text-caption text-muted-foreground">{pet.breed}</p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-center text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-5" aria-hidden />
          <span className="text-body-sm font-medium">Add a pet</span>
        </button>
      </div>

      {adding && (
        <div className="flex items-center gap-2 rounded-xl border border-border p-3">
          <Input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pet's name"
            aria-label="New pet's name"
            className="flex-1"
          />
          <Button size="sm" onClick={handleAdd}>
            Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
