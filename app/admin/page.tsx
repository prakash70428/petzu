"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/features/dashboard/components";
import { formatRelativeTime } from "@/features/dashboard/utils";
import { apiClient } from "@/services/api-client";

interface Overview {
  customers: { total: number; thisWeek: number };
  open: { enquiries: number; bookings: number; partners: number; complaints: number };
  community: { posts: number; postsThisWeek: number; replies: number };
  chats: { total: number; thisWeek: number };
  subscribers: number;
  latest: { id: string; type: string; status: string; subject: string; createdAt: string; customer: { email: string; name: string | null } | null }[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient<{ data: Overview }>("/api/admin/overview")
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-body-sm text-destructive">Couldn&apos;t load the overview. Refresh to try again.</p>;
  if (!data) return <p className="text-body-sm text-muted-foreground">Loading...</p>;

  const tiles = [
    { label: "Booking requests waiting", value: data.open.bookings, href: "/admin/feedback", urgent: data.open.bookings > 0 },
    { label: "Enquiries waiting", value: data.open.enquiries, href: "/admin/feedback", urgent: data.open.enquiries > 0 },
    { label: "Partner requests waiting", value: data.open.partners, href: "/admin/feedback", urgent: data.open.partners > 0 },
    { label: "Complaints open", value: data.open.complaints, href: "/admin/feedback", urgent: data.open.complaints > 0 },
    { label: "Customers", value: data.customers.total, note: `+${data.customers.thisWeek} this week`, href: "/admin/customers" },
    { label: "Community questions", value: data.community.posts, note: `+${data.community.postsThisWeek} this week, ${data.community.replies} answers`, href: "/admin/community" },
    { label: "Chats", value: data.chats.total, note: `+${data.chats.thisWeek} this week`, href: "/admin/customers" },
    { label: "Newsletter subscribers", value: data.subscribers, href: "/admin/exports" },
  ];

  return (
    <>
      <PageHeader title="Overview" description="What needs attention, and how PetZu is growing." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}>
            <Card interactive className={`flex h-full flex-col gap-1 p-card ${tile.urgent ? "border-primary" : ""}`}>
              <p className="text-heading-2 font-semibold text-foreground">{tile.value}</p>
              <p className="text-body-sm text-foreground">{tile.label}</p>
              {tile.note && <p className="text-caption text-muted-foreground">{tile.note}</p>}
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 p-card-lg">
        <h2 className="font-semibold text-foreground">Latest enquiries and bookings</h2>
        {data.latest.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-muted-foreground">Nothing yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {data.latest.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="min-w-0">
                  <p className="truncate text-body-sm font-medium text-foreground">{item.subject}</p>
                  <p className="text-caption text-muted-foreground">
                    {item.customer?.email ?? "No email"} · {formatRelativeTime(item.createdAt)}
                  </p>
                </div>
                <Badge variant={item.status === "OPEN" ? "primary" : "outline"}>{item.status.replace("_", " ").toLowerCase()}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
