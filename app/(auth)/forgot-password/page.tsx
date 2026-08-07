"use client";

import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/features/auth/components";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useForm } from "@/hooks/use-form";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: forgotPasswordSchema,
    initialValues: { email: "" },
    onSubmit: async (submitted) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSentTo(submitted.email);
    },
  });

  const backLink = (
    <Link href="/sign-in" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
      <ArrowLeft className="size-3.5" aria-hidden />
      Back to sign in
    </Link>
  );

  // Success replaces the form in place rather than routing to a separate
  // page — there's nothing to do on the next screen except read one
  // sentence, so a navigation would be pure overhead.
  if (sentTo) {
    return (
      <AuthShell title="Check your inbox" subtitle={`We sent a reset link to ${sentTo}.`} footer={backLink}>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
            <MailCheck className="size-7" aria-hidden />
          </div>
          <p className="text-body-sm text-muted-foreground">
            The link expires in 30 minutes. If it doesn&apos;t arrive, check your spam folder or try again.
          </p>
          <Button variant="outline" onClick={() => setSentTo(null)} className="w-full">
            Use a different email
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={backLink}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            variant={errors.email ? "error" : "default"}
          />
        </FormField>
        <Button type="submit" size="lg" variant="gradient" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Sending link..." : "Send reset link"}
        </Button>
      </form>
    </AuthShell>
  );
}
