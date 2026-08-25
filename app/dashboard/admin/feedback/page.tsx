"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { feedbackStatuses, statusBadgeVariant, statusLabel } from "@/features/feedback/constants";
import { useFeedbackTriage } from "@/features/feedback/hooks";
import type { FeedbackStatus } from "@/features/feedback/types";
import { PageHeader } from "@/features/dashboard/components";
import { formatRelativeTime } from "@/features/dashboard/utils";

const filterOptions: { label: string; value: FeedbackStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  ...feedbackStatuses.map((status) => ({ label: statusLabel[status], value: status })),
];

export default function FeedbackAdminPage() {
  const [filter, setFilter] = useState<FeedbackStatus | "ALL">("ALL");
  const { items, loading, updating, setStatus } = useFeedbackTriage(filter === "ALL" ? undefined : filter);

  return (
    <>
      <PageHeader title="Feedback & complaints" description="Triage what customers have submitted." />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full border px-3 py-1 text-caption font-medium transition-colors ${
              filter === option.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-body-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">Nothing here.</p>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="flex flex-col gap-3 p-card sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{item.subject}</p>
                  <Badge variant={item.type === "COMPLAINT" ? "destructive" : "secondary"}>
                    {item.type === "COMPLAINT" ? "Complaint" : "Feedback"}
                  </Badge>
                </div>
                <p className="mt-1 text-body-sm text-muted-foreground">{item.body}</p>
                <p className="mt-2 text-caption text-muted-foreground">
                  {item.customer?.email ?? "Unknown customer"} · {formatRelativeTime(item.createdAt)}
                </p>
              </div>

              <Select value={item.status} onValueChange={(value) => setStatus(item.id, value as FeedbackStatus)} disabled={updating}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue>
                    <Badge variant={statusBadgeVariant[item.status]}>{statusLabel[item.status]}</Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {feedbackStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
