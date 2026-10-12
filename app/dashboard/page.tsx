"use client";

import { ArrowUpRight, CalendarClock, Dog, FileText, Pill } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useSession } from "@/features/auth/store";
import { PageHeader } from "@/features/dashboard/components";
import { formatDate } from "@/features/dashboard/utils";
import { useHealthState } from "@/features/health/store";
import { DOSE_LABELS, formatTime, todaysDoses } from "@/features/health/utils";
import { usePetProfileState } from "@/features/pet-profile/store";

/** Everything here is the owner's own data (pet profiles and health records), never sample content. */
export default function DashboardPage() {
  const session = useSession();
  const profile = usePetProfileState();
  const health = useHealthState();
  const firstName = session.user?.name.split(" ")[0] ?? "there";
  const now = new Date();

  const upcoming = health.appointments
    .filter((appointment) => new Date(appointment.startsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const doses = todaysDoses(health.medicines, now);
  const petName = (id: string) => profile.pets.find((pet) => pet.id === id)?.name ?? "Your pet";

  const stats = [
    { label: "Saved pets", value: profile.pets.length, href: "/dashboard/pets", icon: Dog },
    { label: "Upcoming visits", value: upcoming.length, href: "/health", icon: CalendarClock },
    { label: "Doses today", value: doses.length, href: "/health", icon: Pill },
    { label: "Health records", value: health.records.length, href: "/health", icon: FileText },
  ];

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} description="Here's what's happening with your pets." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group">
              <Card interactive className="flex h-full flex-col gap-2 p-card">
                <div className="flex items-center justify-between">
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                  <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </div>
                <p className="text-heading-2 font-semibold text-foreground">{stat.value}</p>
                <p className="text-caption text-muted-foreground">{stat.label}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-card-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Upcoming appointments</h2>
            <Link href="/health" className="text-caption font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {upcoming.length === 0 ? (
              <p className="py-6 text-center text-body-sm text-muted-foreground">
                No upcoming appointments.{" "}
                <Link href="/services/vet-booking" className="font-medium text-primary hover:underline">
                  Find a vet
                </Link>
              </p>
            ) : (
              upcoming.slice(0, 4).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-foreground">
                      {appointment.petName}: {appointment.service}
                    </p>
                    <p className="truncate text-caption text-muted-foreground">
                      {appointment.providerName} · {formatDate(appointment.startsAt)} at{" "}
                      {formatTime(new Date(appointment.startsAt))}
                    </p>
                  </div>
                  <Badge variant="info">Upcoming</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-card-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Medicines today</h2>
            <Link href="/health" className="text-caption font-medium text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {doses.length === 0 ? (
              <p className="py-6 text-center text-body-sm text-muted-foreground">Nothing due today.</p>
            ) : (
              doses.map(({ medicine, time }) => (
                <div key={`${medicine.id}-${time}`} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <p className="min-w-0 truncate text-body-sm font-medium text-foreground">
                    {petName(medicine.petId)}: {medicine.name}
                  </p>
                  <span className="shrink-0 text-caption text-muted-foreground">{DOSE_LABELS[time]}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
