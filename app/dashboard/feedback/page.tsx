"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { statusBadgeVariant, statusLabel } from "@/features/feedback/constants";
import { useMyFeedback } from "@/features/feedback/hooks";
import type { FeedbackType } from "@/features/feedback/types";
import { PageHeader } from "@/features/dashboard/components";
import { formatRelativeTime } from "@/features/dashboard/utils";
import { cn } from "@/utils/cn";

function StarPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star className={cn("size-6", star <= value ? "fill-warning text-warning" : "text-muted-foreground/30")} />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const { items, loading, submitting, submit } = useMyFeedback();
  const [type, setType] = useState<FeedbackType>("FEEDBACK");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    submit({ type, subject, body, rating: type === "FEEDBACK" && rating > 0 ? rating : undefined });
    setSubject("");
    setBody("");
    setRating(0);
  }

  return (
    <>
      <PageHeader title="Feedback & complaints" description="Tell us what's working, or what isn't." />

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="p-card-lg lg:w-96 lg:shrink-0">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={type === "FEEDBACK" ? "primary" : "outline"}
              onClick={() => setType("FEEDBACK")}
              className="flex-1"
            >
              Feedback
            </Button>
            <Button
              type="button"
              size="sm"
              variant={type === "COMPLAINT" ? "destructive" : "outline"}
              onClick={() => setType("COMPLAINT")}
              className="flex-1"
            >
              Complaint
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {type === "FEEDBACK" && (
              <FormField label="Rating (optional)" htmlFor="rating">
                <StarPicker value={rating} onChange={setRating} />
              </FormField>
            )}
            <FormField label="Subject" htmlFor="subject">
              <Input
                id="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="A short summary"
                required
              />
            </FormField>
            <FormField label="Details" htmlFor="body">
              <Textarea
                id="body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Tell us more..."
                rows={5}
                required
              />
            </FormField>
            <Button type="submit" disabled={submitting || !subject.trim() || !body.trim()}>
              {submitting ? "Submitting..." : `Submit ${type === "COMPLAINT" ? "complaint" : "feedback"}`}
            </Button>
          </form>
        </Card>

        <div className="flex flex-1 flex-col gap-3">
          <h2 className="font-semibold text-foreground">Your submissions</h2>
          {loading ? (
            <p className="text-body-sm text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">Nothing submitted yet.</p>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="p-card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{item.subject}</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">{item.body}</p>
                  </div>
                  <Badge variant={statusBadgeVariant[item.status]} className="shrink-0">
                    {statusLabel[item.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-caption text-muted-foreground">
                  {item.type === "COMPLAINT" ? "Complaint" : "Feedback"} · {formatRelativeTime(item.createdAt)}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
