export type DashboardIconKey =
  | "dashboard"
  | "dog"
  | "cat"
  | "bird"
  | "rabbit"
  | "package"
  | "truck"
  | "calendar"
  | "stethoscope"
  | "scissors"
  | "bell"
  | "user"
  | "settings";

export interface DashboardPet {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Bird" | "Small pet";
  breed: string;
  age: string;
  initials: string;
  iconKey: DashboardIconKey;
}

export type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";

export interface DashboardOrder {
  id: string;
  reference: string;
  placedAt: string;
  status: OrderStatus;
  itemSummary: string;
  itemCount: number;
  total: number;
}

export type AppointmentStatus = "Upcoming" | "Completed" | "Cancelled";

export interface DashboardAppointment {
  id: string;
  providerName: string;
  providerType: "Vet" | "Groomer";
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export type NotificationCategory = "Order" | "Appointment" | "Account" | "Community";

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  category: NotificationCategory;
}
