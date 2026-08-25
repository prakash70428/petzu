"use client";

import { useParams } from "next/navigation";
import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/features/dashboard/components";
import { useCustomerDetail } from "@/features/crm/hooks";
import { CustomerTimeline } from "@/features/crm/components/customer-timeline";
import { formatRelativeTime } from "@/features/dashboard/utils";

const consentLabel = { EMAIL: "Email", SMS: "SMS", WHATSAPP: "WhatsApp" } as const;
const purposeLabel = { MARKETING: "Marketing", TRANSACTIONAL: "Transactional", SUPPORT: "Support" } as const;

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { customer, loading, saving, submitNote, submitTag, deleteTag } = useCustomerDetail(id);
  const [noteDraft, setNoteDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");

  if (loading) return <p className="text-body-sm text-muted-foreground">Loading...</p>;
  if (!customer) return <p className="text-body-sm text-muted-foreground">Customer not found.</p>;

  const grantedConsents = customer.consents.filter((consent) => consent.granted);

  return (
    <>
      <PageHeader title={customer.name ?? customer.email} description={customer.email} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-card-lg">
            <h2 className="font-semibold text-foreground">Activity timeline</h2>
            <div className="mt-4">
              <CustomerTimeline interactions={customer.interactions} />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-card-lg">
            <h2 className="font-semibold text-foreground">Profile</h2>
            <dl className="mt-3 flex flex-col gap-1.5 text-body-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-foreground">{customer.phone ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Customer since</dt>
                <dd className="text-foreground">{formatRelativeTime(customer.createdAt)}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-card-lg">
            <h2 className="font-semibold text-foreground">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {customer.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                  <button type="button" onClick={() => deleteTag(tag.id)} aria-label={`Remove tag ${tag.name}`}>
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {customer.tags.length === 0 && <p className="text-caption text-muted-foreground">No tags yet.</p>}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!tagDraft.trim()) return;
                submitTag(tagDraft);
                setTagDraft("");
              }}
              className="mt-3 flex gap-2"
            >
              <Input
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                placeholder="Add a tag..."
                inputSize="sm"
              />
              <Button type="submit" size="sm" disabled={saving || !tagDraft.trim()}>
                Add
              </Button>
            </form>
          </Card>

          <Card className="p-card-lg">
            <h2 className="font-semibold text-foreground">Consent</h2>
            <div className="mt-3 flex flex-col gap-1">
              {grantedConsents.length === 0 ? (
                <p className="text-caption text-muted-foreground">No channels opted in yet.</p>
              ) : (
                grantedConsents.map((consent) => (
                  <p key={consent.id} className="text-body-sm text-foreground">
                    {consentLabel[consent.channel]} — {purposeLabel[consent.purpose]}
                  </p>
                ))
              )}
            </div>
          </Card>

          <Card className="p-card-lg">
            <h2 className="font-semibold text-foreground">Staff notes</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!noteDraft.trim()) return;
                submitNote(noteDraft);
                setNoteDraft("");
              }}
              className="mt-3 flex flex-col gap-2"
            >
              <Textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder="Add a note visible to staff only..."
                rows={3}
              />
              <Button type="submit" size="sm" disabled={saving || !noteDraft.trim()} className="self-start">
                Add note
              </Button>
            </form>
            <div className="mt-4 flex flex-col gap-3">
              {customer.notes.map((note) => (
                <div key={note.id} className="border-t pt-3 first:border-t-0 first:pt-0">
                  <p className="text-body-sm text-foreground">{note.body}</p>
                  <p className="text-caption text-muted-foreground">
                    {note.authorEmail} · {formatRelativeTime(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
