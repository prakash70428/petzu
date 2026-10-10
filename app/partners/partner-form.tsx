"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { partnerEnquirySchema, partnerTypes } from "@/features/enquiries/schema";
import { submitEnquiry } from "@/features/enquiries/submit";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";

const formSchema = partnerEnquirySchema.omit({ kind: true });

export function PartnerForm() {
  const [sent, setSent] = useState(false);
  // Honeypot: hidden from people, so only bots fill it (see app/api/enquiries).
  const [website, setWebsite] = useState("");

  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: formSchema,
    initialValues: {
      business: "",
      partnerType: "" as (typeof partnerTypes)[number],
      city: "",
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    onSubmit: async (data) => {
      try {
        await submitEnquiry({ kind: "PARTNERSHIP", ...data, ...(website ? { website } : {}) });
        setSent(true);
      } catch {
        toast({ title: "Couldn't send your request", description: "Please try again in a moment.", variant: "destructive" });
      }
    },
  });

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 border-t border-border pt-8">
        <CheckCircle2 className="size-8 text-success" aria-hidden />
        <h2 className="font-display text-heading-2 text-foreground">Thanks, we&apos;ve got your details</h2>
        <p className="max-w-md text-body text-muted-foreground">
          Our partnerships team will review them and get back to you at {values.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Business name" htmlFor="business" error={errors.business}>
        <Input
          id="business"
          autoComplete="organization"
          value={values.business}
          onChange={(event) => setField("business", event.target.value)}
          variant={errors.business ? "error" : "default"}
        />
      </FormField>
      <FormField label="Type of business" htmlFor="partnerType" error={errors.partnerType}>
        <Select
          value={values.partnerType}
          onValueChange={(value) => setField("partnerType", value as (typeof partnerTypes)[number])}
        >
          <SelectTrigger id="partnerType" className="w-full">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            {partnerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Your name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          variant={errors.name ? "error" : "default"}
        />
      </FormField>
      <FormField label="City" htmlFor="city" error={errors.city}>
        <Input
          id="city"
          autoComplete="address-level2"
          value={values.city}
          onChange={(event) => setField("city", event.target.value)}
          variant={errors.city ? "error" : "default"}
        />
      </FormField>
      <FormField label="Work email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          variant={errors.email ? "error" : "default"}
        />
      </FormField>
      <FormField label="Phone" htmlFor="phone" error={errors.phone} helperText="Optional">
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => setField("phone", event.target.value)}
          variant={errors.phone ? "error" : "default"}
        />
      </FormField>
      <FormField
        label="Tell us about your business"
        htmlFor="message"
        error={errors.message}
        className="sm:col-span-2"
      >
        <Textarea
          id="message"
          rows={4}
          placeholder="What you offer, where, and how you'd like to work with PetZu."
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          variant={errors.message ? "error" : "default"}
        />
      </FormField>
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" variant="gradient" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send partnership request"}
        </Button>
      </div>
    </form>
  );
}
