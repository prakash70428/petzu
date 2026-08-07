import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { ToastItem } from "@/hooks/use-toast";

export const toastVariants = cva(
  "glass-strong pointer-events-auto relative flex w-full max-w-sm gap-3 rounded-xl p-4 shadow-xl [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "[&_svg]:text-foreground",
        info: "[&_svg]:text-info",
        success: "[&_svg]:text-success",
        warning: "[&_svg]:text-warning",
        destructive: "[&_svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const icons: Record<NonNullable<ToastItem["variant"]>, ReactNode> = {
  default: <Info />,
  info: <Info />,
  success: <CheckCircle2 />,
  warning: <TriangleAlert />,
  destructive: <AlertCircle />,
};

export interface ToastProps extends VariantProps<typeof toastVariants> {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const variant = toast.variant ?? "default";

  return (
    <div role="status" className={cn(toastVariants({ variant }))}>
      {icons[variant]}
      <div className="flex flex-1 flex-col gap-0.5">
        {toast.title && (
          <p className="text-body-sm font-medium text-foreground">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-body-sm text-muted-foreground">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
