"use client";

import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRequireAuth } from "@/features/auth/hooks";
import { DashboardNav } from "./dashboard-nav";
import { DashboardShellSkeleton } from "./dashboard-skeletons";

/**
 * Notion/Linear-style app shell: a persistent left rail on desktop, the
 * same nav in a Sheet on mobile. Also acts as the client-side auth gate —
 * `useRequireAuth` redirects unauthenticated visitors to /sign-in.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const session = useRequireAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Rendered while the session hydrates from localStorage, and for the
  // brief moment before the redirect fires for a signed-out visitor —
  // showing the skeleton instead of the real UI avoids flashing private
  // page chrome to someone who isn't allowed to see it.
  if (!session.isAuthenticated || !session.user) {
    return <DashboardShellSkeleton />;
  }

  const { user } = session;

  return (
    <Container className="flex flex-1 gap-10 py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
            <Avatar size="sm">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-caption text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DashboardNav />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 lg:hidden">
          <Sheet
            open={mobileNavOpen}
            onOpenChange={setMobileNavOpen}
            side="left"
            trigger={
              <Button variant="outline" size="sm">
                <Menu className="size-4" />
                Menu
              </Button>
            }
          >
            <SheetHeader>
              <SheetTitle>{user.name}</SheetTitle>
            </SheetHeader>
            <SheetBody>
              <DashboardNav onNavigate={() => setMobileNavOpen(false)} />
            </SheetBody>
          </Sheet>
        </div>

        {children}
      </div>
    </Container>
  );
}
