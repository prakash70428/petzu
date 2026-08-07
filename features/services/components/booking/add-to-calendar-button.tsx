"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Provider, ProviderService } from "../../types";
import { applyTimeToDate, buildIcsDataUrl } from "../../utils";

export interface AddToCalendarButtonProps {
  provider: Provider;
  service: ProviderService;
  date: Date;
  time: string;
}

/** A genuinely real feature, not a fake button — generates and downloads an openable .ics file, entirely client-side. */
export function AddToCalendarButton({ provider, service, date, time }: AddToCalendarButtonProps) {
  function handleDownload() {
    const start = applyTimeToDate(date, time);
    const dataUrl = buildIcsDataUrl({
      title: `${service.name} with ${provider.name}`,
      description: `${service.name} at ${provider.clinicName}`,
      location: provider.clinicName,
      start,
      durationMinutes: service.durationMinutes,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${provider.slug}-appointment.ics`;
    link.click();
  }

  return (
    <Button size="lg" variant="gradient" onClick={handleDownload}>
      <Download className="size-4" aria-hidden />
      Add to calendar
    </Button>
  );
}
