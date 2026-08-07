"use client";

import { BellOff, CalendarClock, Package, Users2, UserCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/features/dashboard/components";
import { mockNotifications } from "@/features/dashboard/constants";
import type { DashboardNotification, NotificationCategory } from "@/features/dashboard/types";
import { formatRelativeTime, getUnreadCount } from "@/features/dashboard/utils";
import { cn } from "@/utils/cn";

const categoryIcons: Record<NotificationCategory, typeof Package> = {
  Order: Package,
  Appointment: CalendarClock,
  Account: UserCircle,
  Community: Users2,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<DashboardNotification[]>(mockNotifications);
  const unreadCount = getUnreadCount(notifications);

  function markAllRead() {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }

  function toggleRead(target: DashboardNotification) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === target.id ? { ...notification, read: !notification.read } : notification,
      ),
    );
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
        action={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No notifications"
          description="Order updates and appointment reminders will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notification) => {
            const Icon = categoryIcons[notification.category];
            return (
              <Card
                key={notification.id}
                className={cn("flex items-start gap-3 p-card", !notification.read && "border-primary/30 bg-accent/40")}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">{notification.title}</p>
                    {!notification.read && <Badge variant="primary">New</Badge>}
                  </div>
                  <p className="mt-0.5 text-body-sm text-muted-foreground">{notification.description}</p>
                  <p className="mt-1 text-caption text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(notification)}
                  className="shrink-0 text-caption font-medium text-primary hover:underline"
                >
                  {notification.read ? "Mark unread" : "Mark read"}
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
