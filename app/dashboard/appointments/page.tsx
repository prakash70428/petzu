"use client";

import { CalendarClock, Scissors, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/features/dashboard/components";
import { mockAppointments } from "@/features/dashboard/constants";
import type { DashboardAppointment } from "@/features/dashboard/types";
import { appointmentStatusVariant, formatDate } from "@/features/dashboard/utils";
import { toast } from "@/hooks/use-toast";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<DashboardAppointment[]>(mockAppointments);

  const upcoming = appointments.filter((appointment) => appointment.status === "Upcoming");
  const past = appointments.filter((appointment) => appointment.status !== "Upcoming");

  function handleCancel(target: DashboardAppointment) {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === target.id ? { ...appointment, status: "Cancelled" } : appointment,
      ),
    );
    toast({
      title: "Appointment cancelled",
      description: `Your ${target.service} with ${target.providerName} was cancelled.`,
      variant: "default",
    });
  }

  return (
    <>
      <PageHeader title="Appointments" description="Your vet and grooming bookings." />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No upcoming appointments"
              description="Book a vet visit or a grooming session to see it here."
              action={
                <Button asChild>
                  <Link href="/services/vet-booking">Book an appointment</Link>
                </Button>
              }
            />
          ) : (
            <AppointmentList appointments={upcoming} onCancel={handleCancel} />
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No past appointments" />
          ) : (
            <AppointmentList appointments={past} />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

function AppointmentList({
  appointments,
  onCancel,
}: {
  appointments: DashboardAppointment[];
  onCancel?: (appointment: DashboardAppointment) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {appointments.map((appointment) => {
        const Icon = appointment.providerType === "Vet" ? Stethoscope : Scissors;
        return (
          <Card
            key={appointment.id}
            className="flex flex-col gap-4 p-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">{appointment.service}</p>
                  <Badge variant={appointmentStatusVariant[appointment.status]}>{appointment.status}</Badge>
                </div>
                <p className="truncate text-body-sm text-muted-foreground">{appointment.providerName}</p>
                <p className="text-caption text-muted-foreground">
                  {formatDate(appointment.date)} at {appointment.time}
                </p>
              </div>
            </div>
            {onCancel && appointment.status === "Upcoming" && (
              <Button variant="outline" size="sm" onClick={() => onCancel(appointment)} className="sm:shrink-0">
                Cancel
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
