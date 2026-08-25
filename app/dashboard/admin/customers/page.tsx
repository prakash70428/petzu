"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/features/dashboard/components";
import { useCustomerList } from "@/features/crm/hooks";

export default function CustomersAdminPage() {
  const [query, setQuery] = useState("");
  const { customers, loading } = useCustomerList(query);

  return (
    <>
      <PageHeader title="Customers" description="Every customer with a real record — profile, consent, chat history, and notes." />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name or email..."
        className="max-w-sm"
      />

      <div className="mt-4 flex flex-col gap-2">
        {loading ? (
          <p className="text-body-sm text-muted-foreground">Loading...</p>
        ) : customers.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">No customers found.</p>
        ) : (
          customers.map((customer) => (
            <Link key={customer.id} href={`/dashboard/admin/customers/${customer.id}`}>
              <Card className="flex items-center justify-between p-card transition-colors hover:bg-accent/40">
                <div>
                  <p className="font-medium text-foreground">{customer.name ?? customer.email}</p>
                  <p className="text-caption text-muted-foreground">{customer.email}</p>
                </div>
                <div className="flex gap-1.5">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
