import {
  Bot,
  Mail,
  MessageCircle,
  MessageSquareWarning,
  ShieldCheck,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { formatRelativeTime } from "@/features/dashboard/utils";
import type { Interaction, InteractionType } from "../types";

const iconByType: Record<InteractionType, LucideIcon> = {
  CONSENT_CHANGED: ShieldCheck,
  CHAT_MESSAGE: Bot,
  EMAIL_SENT: Mail,
  SMS_SENT: MessageCircle,
  WHATSAPP_MESSAGE: MessageCircle,
  FEEDBACK_SUBMITTED: MessageSquareWarning,
  COMPLAINT_FILED: MessageSquareWarning,
  NOTE_ADDED: StickyNote,
};

/**
 * Renders the `Interaction` rows that have been accumulating since Phase 1
 * (consent changes, chat turns, and now staff notes) as a single
 * chronological feed — the payoff described in PHASE-2-0-FOUNDATION.md for
 * modeling one generic timeline instead of one audit table per feature.
 */
export function CustomerTimeline({ interactions }: { interactions: Interaction[] }) {
  if (interactions.length === 0) {
    return <p className="text-body-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-4">
      {interactions.map((interaction) => {
        const Icon = iconByType[interaction.type];
        return (
          <li key={interaction.id} className="flex gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="size-4 text-muted-foreground" aria-hidden />
            </div>
            <div>
              <p className="text-body-sm text-foreground">{interaction.summary}</p>
              <p className="text-caption text-muted-foreground">{formatRelativeTime(interaction.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
