"use client";

import { cn } from "@/utils/cn";
import type { TimeSlot } from "../../types";
import { getTimeSlotsForDate } from "../../utils";

export interface TimeSlotPickerProps {
  providerId: string;
  date: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export function TimeSlotPicker({ providerId, date, selectedTime, onSelectTime }: TimeSlotPickerProps) {
  const slots = getTimeSlotsForDate(providerId, date);
  const morning = slots.filter((slot) => slot.time.endsWith("AM"));
  const afternoon = slots.filter((slot) => slot.time.endsWith("PM"));

  return (
    <div className="flex flex-col gap-5">
      <TimeSlotGroup label="Morning" slots={morning} selectedTime={selectedTime} onSelectTime={onSelectTime} />
      <TimeSlotGroup label="Afternoon" slots={afternoon} selectedTime={selectedTime} onSelectTime={onSelectTime} />
    </div>
  );
}

function TimeSlotGroup({
  label,
  slots,
  selectedTime,
  onSelectTime,
}: {
  label: string;
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}) {
  return (
    <div>
      <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            aria-pressed={slot.time === selectedTime}
            onClick={() => onSelectTime(slot.time)}
            className={cn(
              "rounded-md border px-2 py-2 text-caption font-medium transition-colors duration-150 ease-premium",
              !slot.available && "cursor-not-allowed border-transparent text-muted-foreground/40 line-through",
              slot.available && slot.time !== selectedTime &&
                "border-input text-foreground hover:border-primary hover:bg-accent",
              slot.time === selectedTime && "border-primary bg-primary text-primary-foreground",
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}
