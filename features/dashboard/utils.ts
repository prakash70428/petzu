import { formatPrice } from "@/utils/currency";
import type { AppointmentStatus, DashboardNotification, OrderStatus } from "./types";

/** Alias of the shared `formatPrice` — kept under the dashboard's own name so its call sites read naturally. */
export const formatCurrency = formatPrice;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(iso);
}

export function getUnreadCount(notifications: DashboardNotification[]): number {
  return notifications.filter((notification) => !notification.read).length;
}

export const orderStatusVariant: Record<OrderStatus, "success" | "info" | "secondary" | "destructive"> = {
  Delivered: "success",
  Shipped: "info",
  Processing: "secondary",
  Cancelled: "destructive",
};

export const appointmentStatusVariant: Record<AppointmentStatus, "success" | "info" | "destructive"> = {
  Upcoming: "info",
  Completed: "success",
  Cancelled: "destructive",
};
