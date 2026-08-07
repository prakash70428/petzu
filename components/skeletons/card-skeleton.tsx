import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder shaped like a standard `Card` (image + title + lines). */
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
    </Card>
  );
}
