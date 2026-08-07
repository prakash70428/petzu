"use client";

import { ArrowUpRight, CalendarClock, Bell, Dog, Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useSession } from "@/features/auth/store";
import { PageHeader } from "@/features/dashboard/components";
import {
  mockAppointments,
  mockNotifications,
  mockOrders,
  mockPets,
} from "@/features/dashboard/constants";
import { appointmentStatusVariant, formatDate, formatRelativeTime, getUnreadCount } from "@/features/dashboard/utils";

export default function DashboardPage() {
  const session = useSession();
  const firstName = session.user?.name.split(" ")[0] ?? "there";

  const upcoming = mockAppointments.filter((appointment) => appointment.status === "Upcoming");
  const unreadCount = getUnreadCount(mockNotifications);

  const stats = [
    { label: "Saved pets", value: mockPets.length, href: "/dashboard/pets", icon: Dog },
    { label: "Orders", value: mockOrders.length, href: "/dashboard/orders", icon: Package },
    { label: "Upcoming visits", value: upcoming.length, href: "/dashboard/appointments", icon: CalendarClock },
    { label: "Unread alerts", value: unreadCount, href: "/dashboard/notifications", icon: Bell },
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
            <Link href="/dashboard/appointments" className="text-caption font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {upcoming.length === 0 ? (
              <p className="py-6 text-center text-body-sm text-muted-foreground">No upcoming appointments.</p>
            ) : (
              upcoming.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-foreground">{appointment.service}</p>
                    <p className="truncate text-caption text-muted-foreground">
                      {appointment.providerName} · {formatDate(appointment.date)} at {appointment.time}
                    </p>
                  </div>
                  <Badge variant={appointmentStatusVariant[appointment.status]}>{appointment.status}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-card-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent activity</h2>
            <Link href="/dashboard/notifications" className="text-caption font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {mockNotifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-body-sm font-medium text-foreground">{notification.title}</p>
                  <p className="text-caption text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
