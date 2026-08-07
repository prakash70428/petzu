import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

/** Shown while the session hydrates, and as the Suspense fallback for dashboard routes. */
export function DashboardShellSkeleton() {
  return (
    <Container className="flex flex-1 gap-10 py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <PageSkeleton />
      </div>
    </Container>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <ListSkeleton />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}
