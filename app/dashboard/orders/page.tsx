"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/features/dashboard/components";
import { mockOrders } from "@/features/dashboard/constants";
import { formatCurrency, formatDate, orderStatusVariant } from "@/features/dashboard/utils";

export default function OrdersPage() {
  const orders = mockOrders;

  return (
    <>
      <PageHeader title="Orders" description="Every order you've placed with PetZu." />

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place your first order, it'll show up here."
          action={
            <Button asChild>
              <Link href="/shop">Start shopping</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col gap-4 p-card sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-body-sm font-medium text-foreground">{order.reference}</span>
                  <Badge variant={orderStatusVariant[order.status]}>{order.status}</Badge>
                </div>
                <p className="mt-1 truncate text-body-sm text-muted-foreground">{order.itemSummary}</p>
                <p className="text-caption text-muted-foreground">
                  Placed {formatDate(order.placedAt)} · {order.itemCount}{" "}
                  {order.itemCount === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:shrink-0">
                <span className="font-semibold text-foreground">{formatCurrency(order.total)}</span>
                <Button variant="outline" size="sm">
                  View details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
