"use client";

import { Mail, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)"),
});

const contactPoints = [
  { icon: Mail, label: "Email", value: "hello@thepetzu.world" },
  { icon: MessageCircle, label: "Support", value: "Live chat, 8am–8pm daily" },
  { icon: MapPin, label: "HQ", value: "Portland, OR" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: contactSchema,
    initialValues: { name: "", email: "", message: "" },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSent(true);
      toast({ title: "Message sent", description: "We'll get back to you within a business day." });
    },
  });

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Get in touch</h1>
        <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
          Questions about an order, a booking, or just want to say hi to a fellow pet parent, we&apos;re here.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem]">
        {sent ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border p-card-lg text-center">
            <Mail className="size-8 text-primary" aria-hidden />
            <h2 className="text-heading-4 font-semibold text-foreground">Message sent</h2>
            <p className="max-w-sm text-body-sm text-muted-foreground">
              Thanks for reaching out. We typically reply within one business day.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label="Name" htmlFor="name" error={errors.name}>
              <Input
                id="name"
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
            <FormField label="Message" htmlFor="message" error={errors.message}>
              <Textarea
                id="message"
                rows={5}
                value={values.message}
                onChange={(event) => setField("message", event.target.value)}
                variant={errors.message ? "error" : "default"}
              />
            </FormField>
            <Button type="submit" size="lg" variant="gradient" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
          </form>
        )}

        <div className="flex flex-col gap-6">
          {contactPoints.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </div>
              <div>
                <p className="text-body-sm font-medium text-foreground">{label}</p>
                <p className="text-caption text-muted-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
