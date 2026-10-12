"use client";

import { useEffect } from "react";
import { usePetProfileState } from "@/features/pet-profile/store";
import { toast } from "@/hooks/use-toast";
import { getHealthState, markRemindersSent } from "../store";
import { dueReminders } from "../utils";

const CHECK_EVERY_MS = 60 * 1000;

/**
 * Mounted once for the whole site. Every minute it asks dueReminders() what
 * is due and shows it: as a browser notification when the owner allowed
 * them, and always as an on-page toast. Each reminder is marked sent so it
 * fires once.
 *
 * This only runs while PetZu is open in a tab. Reminders by SMS, WhatsApp
 * and email need a server-side scheduler and real accounts; see
 * PHASE-3-PET-HEALTH-AND-REMINDERS.md.
 */
export function RemindersRunner() {
  const profile = usePetProfileState();

  useEffect(() => {
    if (!profile.hydrated) return;
    const petNames = Object.fromEntries(profile.pets.map((pet) => [pet.id, pet.name]));

    function check() {
      const due = dueReminders(getHealthState(), petNames, new Date());
      if (due.length === 0) return;

      for (const reminder of due) {
        toast({ title: reminder.title, description: reminder.body, variant: "info" });
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            const notification = new Notification(reminder.title, { body: reminder.body, tag: reminder.key });
            notification.onclick = () => {
              window.focus();
              window.location.assign(reminder.href);
            };
          } catch {
            // Some mobile browsers only allow notifications from a service worker; the toast still shows.
          }
        }
      }
      markRemindersSent(due.map((reminder) => reminder.key));
    }

    check();
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [profile.hydrated, profile.pets]);

  return null;
}
