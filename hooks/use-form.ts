"use client";

import { useState, type FormEvent } from "react";

/**
 * Structural shape of a zod schema's `safeParse`, rather than importing
 * zod's own generics. Zod schemas satisfy this automatically, but typing
 * it this way keeps the hook independent of any one zod major version's
 * generic signature — and lets `Values` be driven by `initialValues`,
 * which infers cleanly (a bare `z.ZodType` generic infers `unknown`).
 */
export interface ValidationSchema<Values> {
  safeParse(data: unknown):
    | { success: true; data: Values }
    | { success: false; error: { issues: readonly { path: PropertyKey[]; message: string }[] } };
}

export interface UseFormOptions<Values extends Record<string, unknown>> {
  schema: ValidationSchema<Values>;
  initialValues: Values;
  onSubmit: (values: Values) => void | Promise<void>;
}

/**
 * A small, generic form hook backed by a zod schema — not react-hook-form.
 * The project's forms are simple enough (a handful of fields, no field
 * arrays or cross-form state) that a full form library isn't worth the
 * surface area; zod already solves the genuinely hard part (validation
 * rules), and wiring plain `useState` to it is ~40 lines.
 */
export function useForm<Values extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
}: UseFormOptions<Values>) {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as soon as it's edited — re-validating the
    // whole form on every keystroke would surface errors for fields the
    // user hasn't reached yet, which reads as hostile.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function validate(): boolean {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Partial<Record<keyof Values, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof Values | undefined;
      if (key !== undefined && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { values, errors, setField, handleSubmit, isSubmitting };
}
