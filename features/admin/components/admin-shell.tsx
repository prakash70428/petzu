"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { refreshStaffGate, useStaffGate } from "@/hooks/use-staff-gate";
import { signInAdmin, signOutAdmin } from "@/services/staff-client";
import { cn } from "@/utils/cn";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Enquiries & bookings", href: "/admin/feedback" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Community", href: "/admin/community" },
  { label: "Knowledge base", href: "/admin/knowledge" },
  { label: "Exports", href: "/admin/exports" },
];

/**
 * Admin area shell: its own sign-in (allow-listed email + ADMIN_PASSWORD),
 * independent of the customer-facing placeholder login. Every API behind
 * these pages checks the signed session cookie server-side.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const gate = useStaffGate();
  const pathname = usePathname();

  if (gate.loading) return <p className="text-body-sm text-muted-foreground">Checking access...</p>;
  if (!gate.isStaff) return <AdminSignIn />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" aria-hidden />
          PetZu admin · {gate.email}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await signOutAdmin();
            await refreshStaffGate();
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </div>
      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto border-b">
        {adminNav.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 border-b-2 px-3 py-2 text-body-sm font-medium transition-colors",
                active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}

function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInAdmin(email.trim(), password);
      await refreshStaffGate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border p-card-lg">
      <div>
        <h1 className="font-display text-heading-2 text-foreground">PetZu admin</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">For the PetZu team only.</p>
      </div>
      <FormField label="Email" htmlFor="admin-email">
        <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
      <FormField label="Password" htmlFor="admin-password">
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      {error && <p className="text-body-sm text-destructive">{error}</p>}
      <Button type="submit" variant="gradient" disabled={busy || !email || !password}>
        {busy ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
