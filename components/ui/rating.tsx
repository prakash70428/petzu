import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export interface RatingProps {
  value: number;
  size?: "sm" | "md";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

/** Star rating display — extracted from repeated inline renders across the homepage into one shared primitive. */
export function Rating({ value, size = "sm", showValue = false, reviewCount, className }: RatingProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < Math.round(value) ? "fill-warning text-warning" : "text-muted-foreground/30",
            )}
          />
        ))}
      </div>
      <span className="sr-only">{value.toFixed(1)} out of 5 stars</span>
      {showValue && <span className="text-caption font-medium text-foreground">{value.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-caption text-muted-foreground">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
