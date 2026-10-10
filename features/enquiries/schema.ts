import { z } from "zod";

/** Kinds of business partner the /partners form offers. */
export const partnerTypes = [
  "Vet clinic or hospital",
  "Groomer or spa",
  "Trainer",
  "Pet sitter or walker",
  "Boarding or pet stay",
  "Shelter or rescue",
  "Pharmacy",
  "Pet brand or store",
  "Other",
] as const;

const contact = {
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(200),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)").max(2000),
};

/** Contact page: a question or request from a pet parent. */
export const generalEnquirySchema = z.object({ kind: z.literal("GENERAL"), ...contact });

/** /partners page: a business that wants to work with PetZu. */
export const partnerEnquirySchema = z.object({
  kind: z.literal("PARTNERSHIP"),
  ...contact,
  business: z.string().trim().min(2, "Enter your business name").max(120),
  partnerType: z.enum(partnerTypes, { message: "Choose what kind of business you are" }),
  city: z.string().trim().min(2, "Enter your city").max(80),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[+\d\s-]*$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const enquirySchema = z.discriminatedUnion("kind", [generalEnquirySchema, partnerEnquirySchema]);

export type GeneralEnquiry = z.infer<typeof generalEnquirySchema>;
export type PartnerEnquiry = z.infer<typeof partnerEnquirySchema>;
export type Enquiry = z.infer<typeof enquirySchema>;

/** The subject line staff see in the admin triage queue. */
export function enquirySubject(enquiry: Enquiry): string {
  return enquiry.kind === "PARTNERSHIP"
    ? `Partnership: ${enquiry.business} (${enquiry.partnerType}, ${enquiry.city})`
    : `Contact form: ${enquiry.name}`;
}

/** The body staff read: the message, plus any business details not in the subject. */
export function enquiryBody(enquiry: Enquiry): string {
  if (enquiry.kind === "GENERAL") return enquiry.message;
  const details = [`Contact: ${enquiry.name}`, enquiry.phone ? `Phone: ${enquiry.phone}` : null]
    .filter(Boolean)
    .join("\n");
  return `${enquiry.message}\n\n${details}`;
}
