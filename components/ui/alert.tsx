import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border p-card text-body-sm [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-card border-border text-foreground [&_svg]:text-foreground",
        info: "bg-info/10 border-info/30 text-foreground [&_svg]:text-info",
        success:
          "bg-success/10 border-success/30 text-foreground [&_svg]:text-success",
        warning:
          "bg-warning/10 border-warning/30 text-foreground [&_svg]:text-warning",
        destructive:
          "bg-destructive/10 border-destructive/30 text-foreground [&_svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const defaultIcons: Record<string, ReactNode> = {
  default: <Info />,
  info: <Info />,
  success: <CheckCircle2 />,
  warning: <TriangleAlert />,
  destructive: <AlertCircle />,
};

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  icon?: ReactNode | null;
}

export function Alert({
  className,
  variant = "default",
  title,
  icon,
  children,
  ...props
}: AlertProps) {
  const resolvedIcon = icon === null ? null : icon ?? defaultIcons[variant ?? "default"];

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {resolvedIcon}
      <div className="flex flex-col gap-1">
        {title && <p className="font-medium leading-none">{title}</p>}
        {children && <div className="text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
