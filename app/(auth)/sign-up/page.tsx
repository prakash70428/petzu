"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthDivider, AuthShell, PasswordInput, SocialAuthButtons } from "@/features/auth/components";
import { signupSchema } from "@/features/auth/schemas";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@/hooks/use-form";

export default function SignUpPage() {
  const router = useRouter();
  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: signupSchema,
    initialValues: { name: "", email: "", password: "", confirmPassword: "", agreeToTerms: false },
    onSubmit: async (submitted) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      // Signup routes to OTP verification rather than logging in directly —
      // the email is carried through so the verify screen can show it.
      router.push(`/verify?email=${encodeURIComponent(submitted.email)}`);
    },
  });

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join 128,000+ pet parents on PetZu."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SocialAuthButtons />
      <AuthDivider />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Full name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            variant={errors.name ? "error" : "default"}
          />
        </FormField>
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
        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password}
          helperText="At least 8 characters, with an uppercase letter and a number."
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            showStrength
            value={values.password}
            onChange={(event) => setField("password", event.target.value)}
            variant={errors.password ? "error" : "default"}
          />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(event) => setField("confirmPassword", event.target.value)}
            variant={errors.confirmPassword ? "error" : "default"}
          />
        </FormField>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              className="mt-0.5"
              checked={values.agreeToTerms}
              onCheckedChange={(checked) => setField("agreeToTerms", checked === true)}
            />
            <Label htmlFor="terms" className="cursor-pointer font-normal text-muted-foreground">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
          {errors.agreeToTerms && <p className="text-caption text-destructive">{errors.agreeToTerms}</p>}
        </div>

        <Button type="submit" size="lg" variant="gradient" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
