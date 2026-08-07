"use client";

import { Dog, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/features/dashboard/components";
import { dashboardIcons, mockPets } from "@/features/dashboard/constants";
import type { DashboardPet } from "@/features/dashboard/types";
import { toast } from "@/hooks/use-toast";

export default function SavedPetsPage() {
  const [pets, setPets] = useState<DashboardPet[]>(mockPets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    if (!name.trim()) {
      setError("Give your pet a name");
      return;
    }
    const pet: DashboardPet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      species: "Dog",
      breed: breed.trim() || "Mixed breed",
      age: "Unknown",
      initials: name.trim().slice(0, 2).toUpperCase(),
      iconKey: "dog",
    };
    setPets((prev) => [...prev, pet]);
    setName("");
    setBreed("");
    setError(null);
    setDialogOpen(false);
    toast({ title: "Pet added", description: `${pet.name} is now saved to your profile.`, variant: "success" });
  }

  function handleRemove(pet: DashboardPet) {
    setPets((prev) => prev.filter((item) => item.id !== pet.id));
    toast({ title: "Pet removed", description: `${pet.name} was removed.`, variant: "default" });
  }

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
        description="Pets saved here are pre-filled when you book an appointment."
        action={pets.length > 0 ? addButton : undefined}
      />

      {pets.length === 0 ? (
        <EmptyState
          icon={Dog}
          title="No pets saved yet"
          description="Add your pets so booking appointments takes seconds, not minutes."
          action={addButton}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => {
            const Icon = dashboardIcons[pet.iconKey];
            return (
              <Card key={pet.id} className="flex items-start gap-3 p-card">
                <Avatar size="lg">
                  <AvatarFallback>{pet.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{pet.name}</p>
                  <p className="truncate text-caption text-muted-foreground">{pet.breed}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">
                      <Icon className="size-3" aria-hidden />
                      {pet.species}
                    </Badge>
                    <span className="text-caption text-muted-foreground">{pet.age}</span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${pet.name}`}
                  onClick={() => handleRemove(pet)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add a pet</DialogTitle>
          <DialogDescription>You can add more details later.</DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex flex-col gap-4">
          <FormField label="Name" htmlFor="pet-name" error={error ?? undefined}>
            <Input
              id="pet-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              variant={error ? "error" : "default"}
              placeholder="Biscuit"
            />
          </FormField>
          <FormField label="Breed" htmlFor="pet-breed" helperText="Optional">
            <Input
              id="pet-breed"
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
              placeholder="Golden Retriever"
            />
          </FormField>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add pet</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
