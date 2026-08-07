import type { User } from "./types";

/** Used to "log in" regardless of what was typed — there's no backend to check credentials against. */
export const defaultUser: User = {
  name: "Alex Morgan",
  email: "alex@example.com",
  bio: "Dog mom to Biscuit. Full-time treat dispenser.",
  initials: "AM",
  memberSince: "2025-03-14",
};
