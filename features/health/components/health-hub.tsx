"use client";

import {
  Bell,
  CalendarClock,
  FileText,
  MapPin,
  Paperclip,
  Pill,
  Plus,
  Scale,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PetOnboardingDialog } from "@/features/pet-profile/components";
import { speciesConfig } from "@/features/pet-profile/constants";
import { setActivePet, usePetProfileState } from "@/features/pet-profile/store";
import type { PetProfile } from "@/features/pet-profile/types";
import { lifeStageLabel, lifeStageOf } from "@/features/pet-profile/utils";
import { toast } from "@/hooks/use-toast";
import { deleteFile, loadFile, MAX_FILE_BYTES, saveFile } from "../files";
import {
  addAppointment,
  addMedicine,
  addRecord,
  addWeight,
  removeAppointment,
  removeMedicine,
  removeRecord,
  removeWeight,
  updateAppointment,
  useHealthState,
} from "../store";
import type { AppointmentKind, DoseTime, RecordKind } from "../types";
import { DOSE_LABELS, formatTime, isoDate, todaysDoses } from "../utils";

const RECORD_KINDS: Record<RecordKind, string> = {
  "pre-visit": "Notes for the vet",
  vaccination: "Vaccination record",
  prescription: "Prescription",
  lab: "Blood work / lab report",
  scan: "Scan or X-ray",
  other: "Other",
};

const APPOINTMENT_KINDS: Record<AppointmentKind, string> = {
  vet: "Vet",
  groomer: "Grooming",
  trainer: "Training",
  sitter: "Pet sitting",
  other: "Other",
};

const PHARMACY_SEARCH = "https://www.google.com/maps/search/veterinary+pharmacy+near+me";

/**
 * Client point 13 in one place: what's due today, the pet's medicines with
 * reminders, records from before and after vet visits, and appointments
 * with notes for the vet. Everything is kept on this device (see store.ts).
 */
export function HealthHub() {
  const profile = usePetProfileState();
  const [addPetOpen, setAddPetOpen] = useState(false);
  const pet = profile.pets.find((p) => p.id === profile.activeId) ?? profile.pets[0] ?? null;

  if (!profile.hydrated) return null;

  if (!pet) {
    return (
      <>
        <EmptyState
          icon={Pill}
          title="Add your pet to start their health record"
          description="Medicines, reminders, vet notes and prescriptions, all in one place for each pet."
          action={
            <Button variant="gradient" onClick={() => setAddPetOpen(true)}>
              <Plus className="size-4" aria-hidden />
              Add a pet
            </Button>
          }
        />
        <PetOnboardingDialog open={addPetOpen} onOpenChange={setAddPetOpen} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose a pet">
        {profile.pets.map((p) => {
          const Icon = speciesConfig[p.species].icon;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === pet.id}
              onClick={() => setActivePet(p.id)}
              className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-body-sm font-medium text-foreground transition-colors hover:border-primary/50 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            >
              <Icon className="size-4" aria-hidden />
              {p.name}
            </button>
          );
        })}
        <Button variant="ghost" size="sm" onClick={() => setAddPetOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Add a pet
        </Button>
      </div>

      <NotificationPrompt />

      <Tabs defaultValue="today">
        <TabsList className="flex-wrap">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-6">
          <TodayPanel pet={pet} />
        </TabsContent>
        <TabsContent value="medicines" className="mt-6">
          <MedicinesPanel pet={pet} />
        </TabsContent>
        <TabsContent value="records" className="mt-6">
          <RecordsPanel pet={pet} />
        </TabsContent>
        <TabsContent value="appointments" className="mt-6">
          <AppointmentsPanel pet={pet} />
        </TabsContent>
        <TabsContent value="weight" className="mt-6">
          <WeightPanel pet={pet} />
        </TabsContent>
      </Tabs>

      <PetOnboardingDialog open={addPetOpen} onOpenChange={setAddPetOpen} />
    </div>
  );
}

function NotificationPrompt() {
  // HealthHub only renders after hydration, so reading the browser API here is safe.
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );

  if (permission === "granted" || permission === "unsupported") return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-card sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <p className="text-body-sm text-foreground">
          {permission === "denied"
            ? "Notifications are blocked for PetZu. Allow them in your browser settings to get medicine and appointment reminders."
            : "Turn on notifications to get medicine and appointment reminders on this device."}
        </p>
      </div>
      {permission === "default" && (
        <Button
          size="sm"
          onClick={async () => setPermission(await Notification.requestPermission())}
          className="shrink-0"
        >
          Turn on reminders
        </Button>
      )}
    </div>
  );
}

function TodayPanel({ pet }: { pet: PetProfile }) {
  const health = useHealthState();
  const now = new Date();
  const doses = todaysDoses(
    health.medicines.filter((m) => m.petId === pet.id),
    now,
  );
  const upcoming = health.appointments
    .filter((a) => a.petId === pet.id && new Date(a.startsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const stage = lifeStageOf(pet);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section>
        <h2 className="text-heading-4 font-semibold text-foreground">
          {pet.name}&apos;s medicines today
        </h2>
        {doses.length === 0 ? (
          <p className="mt-3 text-body-sm text-muted-foreground">Nothing due today. Add medicines in the Medicines tab.</p>
        ) : (
          <ol className="mt-4 flex flex-col divide-y divide-border rounded-2xl border border-border">
            {doses.map(({ medicine, time }) => (
              <li key={`${medicine.id}-${time}`} className="flex items-center justify-between gap-4 p-4">
                <span>
                  <span className="block font-medium text-foreground">{medicine.name}</span>
                  <span className="text-caption text-muted-foreground">{medicine.dose}</span>
                </span>
                <Badge variant="secondary">{DOSE_LABELS[time]}</Badge>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h2 className="text-heading-4 font-semibold text-foreground">Coming up</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-body-sm text-muted-foreground">
            No appointments booked.{" "}
            <Link href="/services/vet-booking" className="font-medium text-primary hover:underline">
              Find a vet
            </Link>
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {upcoming.slice(0, 3).map((a) => (
              <li key={a.id} className="rounded-2xl border border-border p-4">
                <p className="font-medium text-foreground">
                  {a.service} with {a.providerName}
                </p>
                <p className="text-caption text-muted-foreground">
                  {new Date(a.startsAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}{" "}
                  at {formatTime(new Date(a.startsAt))}
                </p>
              </li>
            ))}
          </ul>
        )}
        {stage && (
          <p className="mt-6 text-body-sm text-muted-foreground">
            Life stage: <span className="font-medium text-foreground">{lifeStageLabel(stage, pet.species)}</span>.{" "}
            {stage === "senior" && "Senior pets do best with a check-up every six months."}
            {stage === "baby" && "Keep the vaccination record from each visit in Records."}
          </p>
        )}
      </section>
    </div>
  );
}

function MedicinesPanel({ pet }: { pet: PetProfile }) {
  const health = useHealthState();
  const medicines = health.medicines.filter((m) => m.petId === pet.id);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [times, setTimes] = useState<DoseTime[]>(["morning"]);
  const [startDate, setStartDate] = useState(isoDate(new Date()));
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) return setError("Enter the medicine's name");
    if (times.length === 0) return setError("Pick at least one time of day");
    if (endDate && endDate < startDate) return setError("The end date is before the start date");
    addMedicine({
      petId: pet.id,
      name: name.trim(),
      dose: dose.trim(),
      times,
      startDate,
      ...(endDate ? { endDate } : {}),
    });
    setName("");
    setDose("");
    setEndDate("");
    setError(null);
    toast({ title: "Medicine added", description: `We'll remind you when ${pet.name}'s doses are due.`, variant: "success" });
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
      <section>
        {medicines.length === 0 ? (
          <EmptyState icon={Pill} title={`No medicines for ${pet.name} yet`} description="Add one and get a reminder at each dose time." />
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
            {medicines.map((m) => (
              <li key={m.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {m.name} {m.dose && <span className="font-normal text-muted-foreground">· {m.dose}</span>}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {m.times.map((t) => DOSE_LABELS[t]).join(", ")} · from {m.startDate}
                    {m.endDate ? ` to ${m.endDate}` : ", ongoing"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={PHARMACY_SEARCH} target="_blank" rel="noopener noreferrer">
                      <MapPin className="size-3.5" aria-hidden />
                      Pharmacy near me
                    </a>
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`Remove ${m.name}`} onClick={() => removeMedicine(m.id)}>
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-border p-card-lg">
        <h2 className="text-heading-4 font-semibold text-foreground">Add a medicine</h2>
        <FormField label="Medicine" htmlFor="med-name">
          <Input id="med-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Apoquel 16 mg" />
        </FormField>
        <FormField label="Dose" htmlFor="med-dose" helperText="Optional">
          <Input id="med-dose" value={dose} onChange={(e) => setDose(e.target.value)} placeholder="e.g. 1 tablet" />
        </FormField>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-body-sm font-medium text-foreground">When</legend>
          {(Object.keys(DOSE_LABELS) as DoseTime[]).map((time) => (
            <div key={time} className="flex items-center gap-2.5">
              <Checkbox
                id={`med-time-${time}`}
                checked={times.includes(time)}
                onCheckedChange={(checked) =>
                  setTimes((prev) => (checked === true ? [...prev, time] : prev.filter((t) => t !== time)))
                }
              />
              <Label htmlFor={`med-time-${time}`} className="cursor-pointer font-normal">
                {DOSE_LABELS[time]}
              </Label>
            </div>
          ))}
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="From" htmlFor="med-start">
            <Input id="med-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </FormField>
          <FormField label="Until" htmlFor="med-end" helperText="Optional">
            <Input id="med-end" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
          </FormField>
        </div>
        {error && <p className="text-caption text-destructive">{error}</p>}
        <Button type="submit" variant="gradient">
          Add medicine
        </Button>
      </form>
    </div>
  );
}

function RecordsPanel({ pet }: { pet: PetProfile }) {
  const health = useHealthState();
  const records = health.records.filter((r) => r.petId === pet.id);
  const [kind, setKind] = useState<RecordKind>("prescription");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(isoDate(new Date()));
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 2) return setError("Give the record a title");
    if (file && file.size > MAX_FILE_BYTES) return setError("That file is over 10 MB");
    setSaving(true);
    try {
      let fileFields = {};
      if (file) {
        const fileId = `file-${Date.now().toString(36)}`;
        await saveFile(fileId, file);
        fileFields = { fileId, fileName: file.name, fileType: file.type };
      }
      addRecord({ petId: pet.id, kind, title: title.trim(), date, note: note.trim(), ...fileFields });
      setTitle("");
      setNote("");
      setFile(null);
      setError(null);
      (event.target as HTMLFormElement).reset();
      toast({ title: "Saved to records", variant: "success" });
    } catch {
      setError("Couldn't save the file on this device. Try a smaller file.");
    } finally {
      setSaving(false);
    }
  }

  async function openFile(fileId: string) {
    const blob = await loadFile(fileId);
    if (!blob) return toast({ title: "File not found on this device", variant: "destructive" });
    window.open(URL.createObjectURL(blob), "_blank", "noopener");
  }

  async function remove(id: string, fileId?: string) {
    if (fileId) await deleteFile(fileId).catch(() => undefined);
    removeRecord(id);
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
      <section>
        {records.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={`No records for ${pet.name} yet`}
            description="Before a visit, add symptoms, scans or blood work for the vet. After it, add the prescription so you never lose it."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
            {records.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{RECORD_KINDS[r.kind]}</Badge>
                    <span className="text-caption text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="mt-1 font-medium text-foreground">{r.title}</p>
                  {r.note && <p className="mt-1 whitespace-pre-line text-body-sm text-muted-foreground">{r.note}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r.fileId && (
                    <Button size="sm" variant="outline" onClick={() => openFile(r.fileId!)}>
                      <Paperclip className="size-3.5" aria-hidden />
                      Open file
                    </Button>
                  )}
                  {r.kind === "prescription" && (
                    <Button asChild size="sm" variant="outline">
                      <a href={PHARMACY_SEARCH} target="_blank" rel="noopener noreferrer">
                        <MapPin className="size-3.5" aria-hidden />
                        Buy medicines nearby
                      </a>
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" aria-label={`Delete ${r.title}`} onClick={() => remove(r.id, r.fileId)}>
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-border p-card-lg">
        <h2 className="text-heading-4 font-semibold text-foreground">Add a record</h2>
        <FormField label="Type" htmlFor="rec-kind">
          <Select value={kind} onValueChange={(v) => setKind(v as RecordKind)}>
            <SelectTrigger id="rec-kind" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(RECORD_KINDS) as RecordKind[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {RECORD_KINDS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Title" htmlFor="rec-title">
          <Input
            id="rec-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={kind === "pre-visit" ? "e.g. Itching for 2 weeks" : "e.g. Skin allergy prescription"}
          />
        </FormField>
        <FormField label="Date" htmlFor="rec-date">
          <Input id="rec-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
        <FormField label="Notes" htmlFor="rec-note" helperText="Optional">
          <Textarea id="rec-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </FormField>
        <FormField label="Photo or PDF" htmlFor="rec-file" helperText="Optional, up to 10 MB. Stays on this device.">
          <Input
            id="rec-file"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </FormField>
        {error && <p className="text-caption text-destructive">{error}</p>}
        <Button type="submit" variant="gradient" disabled={saving}>
          {saving ? "Saving..." : "Save record"}
        </Button>
      </form>
    </div>
  );
}

function AppointmentsPanel({ pet }: { pet: PetProfile }) {
  const health = useHealthState();
  const now = new Date();
  const appointments = health.appointments
    .filter((a) => a.petId === pet.id)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  const [kind, setKind] = useState<AppointmentKind>("vet");
  const [providerName, setProviderName] = useState("");
  const [service, setService] = useState("");
  const [when, setWhen] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (providerName.trim().length < 2) return setError("Who is the appointment with?");
    if (!when) return setError("Pick a date and time");
    addAppointment({
      petId: pet.id,
      petName: pet.name,
      kind,
      providerName: providerName.trim(),
      service: service.trim() || APPOINTMENT_KINDS[kind],
      startsAt: new Date(when).toISOString(),
      notes: notes.trim(),
    });
    setProviderName("");
    setService("");
    setWhen("");
    setNotes("");
    setError(null);
    toast({ title: "Appointment added", description: "You'll get a reminder the day before.", variant: "success" });
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
      <section>
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No appointments yet"
            description="Bookings made on PetZu appear here by themselves. You can also add one you booked elsewhere."
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {appointments.map((a) => {
              const start = new Date(a.startsAt);
              const past = start < now;
              return (
                <li key={a.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {a.service} with {a.providerName}
                      </p>
                      <p className="text-caption text-muted-foreground">
                        {start.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} at{" "}
                        {formatTime(start)}
                        {a.reference && ` · Ref ${a.reference}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={past ? "outline" : "primary"}>{past ? "Done" : "Upcoming"}</Badge>
                      <Button size="icon" variant="ghost" aria-label="Remove appointment" onClick={() => removeAppointment(a.id)}>
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                  {a.kind === "vet" && (
                    <div className="mt-3">
                      <Label htmlFor={`notes-${a.id}`} className="text-caption text-muted-foreground">
                        {past ? "Visit notes" : "Notes for the vet (symptoms, questions, recent changes)"}
                      </Label>
                      <Textarea
                        id={`notes-${a.id}`}
                        rows={2}
                        defaultValue={a.notes}
                        onBlur={(e) => e.target.value !== a.notes && updateAppointment(a.id, { notes: e.target.value })}
                        className="mt-1"
                      />
                      {past && (
                        <p className="mt-2 text-caption text-muted-foreground">
                          Got a prescription? Add it in Records so you don&apos;t lose it.
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-border p-card-lg">
        <h2 className="text-heading-4 font-semibold text-foreground">Add an appointment</h2>
        <FormField label="Type" htmlFor="apt-kind">
          <Select value={kind} onValueChange={(v) => setKind(v as AppointmentKind)}>
            <SelectTrigger id="apt-kind" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(APPOINTMENT_KINDS) as AppointmentKind[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {APPOINTMENT_KINDS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="With" htmlFor="apt-provider">
          <Input id="apt-provider" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="e.g. Dr. Meera Rao" />
        </FormField>
        <FormField label="For" htmlFor="apt-service" helperText="Optional">
          <Input id="apt-service" value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Vaccination" />
        </FormField>
        <FormField label="When" htmlFor="apt-when">
          <Input id="apt-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        </FormField>
        {kind === "vet" && (
          <FormField label="Notes for the vet" htmlFor="apt-notes" helperText="Optional">
            <Textarea id="apt-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </FormField>
        )}
        {error && <p className="text-caption text-destructive">{error}</p>}
        <Button type="submit" variant="gradient">
          Add appointment
        </Button>
      </form>
    </div>
  );
}

/** Weigh-ins over time (proposal: "weight tracker"), with a small trend line. */
function WeightPanel({ pet }: { pet: PetProfile }) {
  const health = useHealthState();
  const entries = (health.weights ?? []).filter((w) => w.petId === pet.id);
  const [date, setDate] = useState(isoDate(new Date()));
  const [kg, setKg] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = Number(kg);
    if (!Number.isFinite(value) || value <= 0 || value > 150) return setError("Enter a weight in kg, e.g. 24.5");
    addWeight({ petId: pet.id, date, kg: Math.round(value * 10) / 10 });
    setKg("");
    setError(null);
  }

  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];
  const change = latest && previous ? Math.round((latest.kg - previous.kg) * 10) / 10 : null;

  // Simple SVG trend: 100 x 40 viewBox, padded so the line never touches the edge.
  const min = Math.min(...entries.map((e) => e.kg));
  const max = Math.max(...entries.map((e) => e.kg));
  const points = entries
    .map((e, i) => {
      const x = entries.length === 1 ? 50 : 4 + (i / (entries.length - 1)) * 92;
      const y = max === min ? 20 : 36 - ((e.kg - min) / (max - min)) * 32;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
      <section>
        {entries.length === 0 ? (
          <EmptyState icon={Scale} title={`No weigh-ins for ${pet.name} yet`} description="Log a weight after each vet visit or monthly at home to spot changes early." />
        ) : (
          <>
            <div className="rounded-2xl border border-border p-card">
              <p className="text-caption text-muted-foreground">Latest</p>
              <p className="text-heading-2 font-semibold text-foreground">
                {latest.kg} kg{" "}
                {change !== null && change !== 0 && (
                  <span className="text-body-sm font-normal text-muted-foreground">
                    ({change > 0 ? "+" : ""}
                    {change} kg since the last weigh-in)
                  </span>
                )}
              </p>
              {entries.length > 1 && (
                <svg viewBox="0 0 100 40" role="img" aria-label={`Weight trend for ${pet.name}`} className="mt-3 h-24 w-full">
                  <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" vectorEffect="non-scaling-stroke" />
                </svg>
              )}
            </div>
            <ul className="mt-4 flex flex-col divide-y divide-border rounded-2xl border border-border">
              {[...entries].reverse().map((e) => (
                <li key={e.id} className="flex items-center justify-between p-3 text-body-sm">
                  <span className="text-muted-foreground">{e.date}</span>
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    {e.kg} kg
                    <Button size="icon" variant="ghost" aria-label={`Remove ${e.date} weigh-in`} onClick={() => removeWeight(e.id)}>
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-border p-card-lg">
        <h2 className="text-heading-4 font-semibold text-foreground">Log a weight</h2>
        <FormField label="Weight (kg)" htmlFor="wt-kg">
          <Input id="wt-kg" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="e.g. 24.5" />
        </FormField>
        <FormField label="Date" htmlFor="wt-date">
          <Input id="wt-date" type="date" value={date} max={isoDate(new Date())} onChange={(e) => setDate(e.target.value)} />
        </FormField>
        {error && <p className="text-caption text-destructive">{error}</p>}
        <Button type="submit" variant="gradient">
          Save weight
        </Button>
      </form>
    </div>
  );
}
