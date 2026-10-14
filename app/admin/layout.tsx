import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/constants/seo";
import { AdminShell } from "@/features/admin/components/admin-shell";

export const metadata: Metadata = {
  ...buildMetadata({ title: "Admin", path: "/admin" }),
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Section spacing="sm">
      <AdminShell>{children}</AdminShell>
    </Section>
  );
}
