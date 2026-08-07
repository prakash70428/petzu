"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthShell, OtpInput } from "@/features/auth/components";
import { defaultUser } from "@/features/auth/constants";
import { otpSchema } from "@/features/auth/schemas";
import { login } from "@/features/auth/store";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const RESEND_SECONDS = 30;

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = otpSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    // No backend to verify against — `000000` is wired as the explicit
    // "wrong code" case purely so the error state is reachable and
    // demonstrable; anything else succeeds.
    if (code === "000000") {
      setError("That code isn't right. Check your email and try again.");
      setIsSubmitting(false);
      return;
    }

    login(defaultUser);
    router.push("/dashboard");
  }

  function handleResend() {
    setSecondsLeft(RESEND_SECONDS);
    setCode("");
    setError(null);
    toast({ title: "Code resent", description: `A new code is on its way to ${email}.`, variant: "success" });
  }

  return (
    <AuthShell
      title="Check your email"
      subtitle={`We sent a 6-digit code to ${email}.`}
      footer={
        <Link href="/sign-up" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to sign up
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <OtpInput value={code} onChange={setCode} />

        {error && (
          <Alert variant="destructive" title="Verification failed">
            {error}
          </Alert>
        )}

        <Button type="submit" size="lg" variant="gradient" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Verifying..." : "Verify email"}
        </Button>

        <p className="text-center text-caption text-muted-foreground">
          {secondsLeft > 0 ? (
            <>Didn&apos;t get it? Resend in {secondsLeft}s</>
          ) : (
            <button type="button" onClick={handleResend} className="font-medium text-primary hover:underline">
              Resend code
            </button>
          )}
        </p>
      </form>
    </AuthShell>
  );
}

export default function VerifyPage() {
  // `useSearchParams` requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={<AuthShell title="Check your email" />}>
      <VerifyForm />
    </Suspense>
  );
}
