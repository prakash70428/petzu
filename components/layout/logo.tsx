import { PawPrint } from "lucide-react";
import Link from "next/link";
import { routes } from "@/constants/routes";
import { siteConfig } from "@/constants/site";
import { cn } from "@/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "inline-flex items-center gap-2 font-display text-heading-4 font-semibold text-foreground",
        className,
      )}
    >
      <PawPrint className="size-6 text-primary" aria-hidden />
      {siteConfig.shortName}
    </Link>
  );
}
