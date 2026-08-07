import { ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Breadcrumb({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <nav aria-label="Breadcrumb" className={className} {...props} />;
}

export function BreadcrumbList({ className, ...props }: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-body-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("flex items-center gap-1.5", className)} {...props} />;
}

export function BreadcrumbLink({
  className,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbPage({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-current="page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ children }: { children?: ReactNode }) {
  return (
    <span role="presentation" className="text-muted-foreground/60">
      {children ?? <ChevronRight className="size-3.5" />}
    </span>
  );
}

export function BreadcrumbEllipsis() {
  return (
    <span role="presentation" aria-hidden className="flex size-6 items-center justify-center">
      <MoreHorizontal className="size-3.5" />
    </span>
  );
}
