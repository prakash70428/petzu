import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "empty" | "error";
  className?: string;
}

/**
 * The one empty/error-state shell used across the dashboard (and the
 * pattern earlier milestones each rolled inline — see AUTH.md §6 for why
 * it's being formalized here rather than left duplicated).
 */
export function EmptyState({ icon: Icon, title, description, action, tone = "empty", className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full",
          tone === "error" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {description && <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
