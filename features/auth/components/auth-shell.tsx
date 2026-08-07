import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { FloatingBackground } from "@/components/motion/floating-background";

export interface AuthShellProps {
  title: string;
  subtitle?: string;
  /** Optional so the shell can also serve as a Suspense fallback while a form's client data resolves. */
  children?: ReactNode;
  footer?: ReactNode;
}

/** The one centered-card shell every auth page (login, signup, OTP, forgot password) renders inside. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <FloatingBackground intensity="vivid" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="glass-strong rounded-3xl p-8 shadow-2xl sm:p-10">
          <div className="text-center">
            <h1 className="text-heading-2 font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="mt-2 text-body-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="mt-8">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-body-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}
