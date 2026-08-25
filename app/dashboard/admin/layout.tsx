"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { useStaffGate } from "@/hooks";
import { cn } from "@/utils/cn";

const adminNav = [
  { label: "Customers", href: "/dashboard/admin/customers" },
  { label: "Feedback", href: "/dashboard/admin/feedback" },
  { label: "Knowledge base", href: "/dashboard/admin/knowledge" },
];

/**
 * Shared gate + sub-nav for every `/dashboard/admin/**` page. This is the
 * "real staff-only shell" flagged as follow-up work in
 * PHASE-2-2-KNOWLEDGE-BASE.md — until now, staff reached the knowledge-base
 * admin page by URL with no way to discover the rest of the admin area.
 *
 * This is a UX gate only, same as `useStaffGate()` itself: every staff-only
 * write route re-checks `isStaff()` server-side regardless of what renders
 * here (see `lib/auth/is-staff.ts`).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isStaff, loading } = useStaffGate();
  const pathname = usePathname();

  if (loading) {
    return <p className="text-body-sm text-muted-foreground">Checking access...</p>;
  }

  if (!isStaff) {
    return (
      <Alert variant="destructive" title="Restricted to staff">
        This area is only available to PetZu staff accounts.
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex gap-1 border-b">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "border-b-2 px-3 py-2 text-body-sm font-medium transition-colors",
              pathname === item.href
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
