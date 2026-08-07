"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import {
  addMonths,
  formatMonthYear,
  getMonthMatrix,
  isDateAvailable,
  isPastDate,
  isSameDay,
} from "../../utils";

export interface CalendarProps {
  providerId: string;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * A small hand-built month-grid — no date-picker library. The whole app
 * only needs "pick a day in the current or next couple months," which is
 * a page of date math, not a dependency.
 */
export function Calendar({ providerId, selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const weeks = getMonthMatrix(visibleMonth.getFullYear(), visibleMonth.getMonth());

  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground">{formatMonthYear(visibleMonth)}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-caption text-muted-foreground" aria-hidden>
        {WEEKDAY_LABELS.map((label, index) => (
          <div key={index}>{label}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1" role="grid">
        {weeks.flat().map((date, index) => {
          const inCurrentMonth = date.getMonth() === visibleMonth.getMonth();
          const disabled = isPastDate(date) || !inCurrentMonth;
          const available = !disabled && isDateAvailable(providerId, date);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={index}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-label={date.toDateString()}
              disabled={disabled || !available}
              onClick={() => onSelectDate(date)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg text-body-sm transition-colors duration-150 ease-premium",
                !inCurrentMonth && "text-muted-foreground/30",
                inCurrentMonth && disabled && "text-muted-foreground/30",
                inCurrentMonth && !disabled && !available && "text-muted-foreground/50 line-through",
                inCurrentMonth && !disabled && available && !selected && "text-foreground hover:bg-accent",
                selected && "bg-primary text-primary-foreground",
                isToday && !selected && "font-semibold text-primary",
              )}
            >
              {date.getDate()}
              {available && !selected && inCurrentMonth && (
                <span className="absolute bottom-1 size-1 rounded-full bg-success" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
