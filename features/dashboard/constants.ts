import {
  Bell,
  Bird,
  CalendarClock,
  Cat,
  Dog,
  LayoutDashboard,
  MessageSquare,
  Package,
  Rabbit,
  Scissors,
  Settings,
  Stethoscope,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";
import type { NavItem } from "@/types";
import type {
  DashboardAppointment,
  DashboardIconKey,
  DashboardNotification,
  DashboardOrder,
  DashboardPet,
} from "./types";

export const dashboardIcons: Record<DashboardIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  package: Package,
  truck: Truck,
  calendar: CalendarClock,
  stethoscope: Stethoscope,
  scissors: Scissors,
  bell: Bell,
  user: User,
  settings: Settings,
  message: MessageSquare,
};

export const dashboardNav: (NavItem & { iconKey: DashboardIconKey })[] = [
  { label: "Dashboard", href: "/dashboard", iconKey: "dashboard" },
  { label: "Saved pets", href: "/dashboard/pets", iconKey: "dog" },
  { label: "Orders", href: "/dashboard/orders", iconKey: "package" },
  { label: "Appointments", href: "/dashboard/appointments", iconKey: "calendar" },
  { label: "Notifications", href: "/dashboard/notifications", iconKey: "bell" },
  { label: "Feedback", href: "/dashboard/feedback", iconKey: "message" },
  { label: "Profile", href: "/dashboard/profile", iconKey: "user" },
  { label: "Settings", href: "/dashboard/settings", iconKey: "settings" },
];

export const mockPets: DashboardPet[] = [
  { id: "pet-1", name: "Biscuit", species: "Dog", breed: "Golden Retriever", age: "3 years", initials: "BI", iconKey: "dog" },
  { id: "pet-2", name: "Luna", species: "Cat", breed: "British Shorthair", age: "2 years", initials: "LU", iconKey: "cat" },
];

export const mockOrders: DashboardOrder[] = [
  {
    id: "ord-1",
    reference: "PZ-482913",
    placedAt: "2026-07-30",
    status: "Delivered",
    itemSummary: "Orthopedic Memory Foam Bed + 2 more",
    itemCount: 3,
    total: 148.5,
  },
  {
    id: "ord-2",
    reference: "PZ-471822",
    placedAt: "2026-07-18",
    status: "Shipped",
    itemSummary: "Grain-Free Salmon Recipe (x2)",
    itemCount: 2,
    total: 108,
  },
  {
    id: "ord-3",
    reference: "PZ-460207",
    placedAt: "2026-06-29",
    status: "Delivered",
    itemSummary: "Interactive Puzzle Feeder",
    itemCount: 1,
    total: 28,
  },
  {
    id: "ord-4",
    reference: "PZ-455190",
    placedAt: "2026-06-11",
    status: "Cancelled",
    itemSummary: "Adjustable Step-In Harness",
    itemCount: 1,
    total: 32,
  },
];

export const mockAppointments: DashboardAppointment[] = [
  {
    id: "apt-1",
    providerName: "Dr. Maya Reyes",
    providerType: "Vet",
    service: "Wellness exam",
    date: "2026-08-12",
    time: "10:30 AM",
    status: "Upcoming",
  },
  {
    id: "apt-2",
    providerName: "Riley Chen",
    providerType: "Groomer",
    service: "Full groom",
    date: "2026-07-22",
    time: "2:00 PM",
    status: "Completed",
  },
  {
    id: "apt-3",
    providerName: "Dr. Owen Park",
    providerType: "Vet",
    service: "Sick visit",
    date: "2026-06-30",
    time: "9:00 AM",
    status: "Completed",
  },
];

export const mockNotifications: DashboardNotification[] = [
  {
    id: "note-1",
    title: "Your order has shipped",
    description: "PZ-471822 is on its way — expected in 2 days.",
    createdAt: "2026-08-03T14:20:00Z",
    read: false,
    category: "Order",
  },
  {
    id: "note-2",
    title: "Appointment reminder",
    description: "Wellness exam with Dr. Maya Reyes is in 3 days.",
    createdAt: "2026-08-02T09:00:00Z",
    read: false,
    category: "Appointment",
  },
  {
    id: "note-3",
    title: "Welcome to PetZu!",
    description: "Your account is all set up. Add a pet to get personalized recommendations.",
    createdAt: "2026-07-30T11:00:00Z",
    read: true,
    category: "Account",
  },
  {
    id: "note-4",
    title: "New reply on your community post",
    description: "Maya T. replied to your post about harness recommendations.",
    createdAt: "2026-07-28T16:45:00Z",
    read: true,
    category: "Community",
  },
];
