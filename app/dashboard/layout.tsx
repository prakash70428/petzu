import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/constants/seo";
import { DashboardShell } from "@/features/dashboard/components";

export const metadata: Metadata = {
  ...buildMetadata({ title: "Dashboard", path: "/dashboard" }),
  // Private, user-specific pages should never be indexed.
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
