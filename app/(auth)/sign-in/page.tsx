"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthDivider, AuthShell, PasswordInput, SocialAuthButtons } from "@/features/auth/components";
import { defaultUser } from "@/features/auth/constants";
import { loginSchema } from "@/features/auth/schemas";
import { login } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useForm } from "@/hooks/use-form";

export default function SignInPage() {
  const router = useRouter();
  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: loginSchema,
    initialValues: { email: "", password: "" },
    onSubmit: async () => {
      // No backend — any well-formed credentials "work." A ~700ms delay
      // stands in for the real network round-trip a login call would take.
      await new Promise((resolve) => setTimeout(resolve, 700));
      login(defaultUser);
      router.push("/dashboard");
    },
  });

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your pets, orders, and appointments."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <SocialAuthButtons />
      <AuthDivider />
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
        <FormField label="Password" htmlFor="password" error={errors.password}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => setField("password", event.target.value)}
            variant={errors.password ? "error" : "default"}
          />
        </FormField>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-caption font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" variant="gradient" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
