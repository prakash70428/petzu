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
import type { DashboardIconKey } from "./types";

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
  { label: "Health records", href: "/health", iconKey: "stethoscope" },
  { label: "Feedback", href: "/dashboard/feedback", iconKey: "message" },
  { label: "Profile", href: "/dashboard/profile", iconKey: "user" },
  { label: "Settings", href: "/dashboard/settings", iconKey: "settings" },
];
