import { prisma } from "@/lib/prisma";
import { recordInteraction } from "@/lib/crm/activity";
import type { Customer, ConsentChannel, ConsentPurpose, InteractionType, MessageLog } from "@prisma/client";
import { sendEmail } from "./adapters/email-resend";
import { sendSms } from "./adapters/sms-msg91";
import { sendWhatsApp } from "./adapters/whatsapp-meta";
import { renderTemplate, type TemplateData, type TemplateKey } from "./templates";
import { AdapterNotConfiguredError, type Adapter } from "./types";

const adapters: Record<ConsentChannel, Adapter> = {
  EMAIL: sendEmail,
  SMS: sendSms,
  WHATSAPP: sendWhatsApp,
};

const interactionTypeByChannel: Record<ConsentChannel, InteractionType> = {
  EMAIL: "EMAIL_SENT",
  SMS: "SMS_SENT",
  WHATSAPP: "WHATSAPP_MESSAGE",
};

function resolveRecipient(customer: Customer, channel: ConsentChannel): string {
  if (channel === "EMAIL") return customer.email;
  if (!customer.phone) throw new Error(`Customer has no phone number on file for a ${channel} send`);
  return customer.phone;
}

export interface SendMessageInput {
  customerId: string;
  channel: ConsentChannel;
  purpose: ConsentPurpose;
  templateKey: TemplateKey;
  data?: TemplateData;
}

/**
 * The single entry point every future trigger (order placed, appointment
 * reminder, feedback acknowledgement, Phase 6's WhatsApp auto-replies) calls
 * instead of hitting an adapter directly. Three things always happen here,
 * in order, regardless of channel: a consent check, a `MessageLog` row, and
 * — on success — an `Interaction` entry.
 *
 * Consent is checked for every purpose, including TRANSACTIONAL — no
 * exception carved out. See "Why every purpose is consent-gated, no
 * exceptions" in PHASE-2-5-COMMS.md: this follows directly from Phase 1's
 * "absence of a row means not granted" rule, which was already decided
 * before this phase existed, not something this dispatcher invents.
 */
export async function sendMessage(input: SendMessageInput): Promise<MessageLog> {
  const customer = await prisma.customer.findUniqueOrThrow({ where: { id: input.customerId } });

  const consent = await prisma.consent.findUnique({
    where: {
      customerId_channel_purpose: {
        customerId: input.customerId,
        channel: input.channel,
        purpose: input.purpose,
      },
    },
  });

  const base = {
    customerId: input.customerId,
    channel: input.channel,
    purpose: input.purpose,
    templateKey: input.templateKey,
  };

  if (!consent?.granted) {
    return prisma.messageLog.create({ data: { ...base, status: "SKIPPED_NO_CONSENT" } });
  }

  const log = await prisma.messageLog.create({ data: { ...base, status: "QUEUED" } });
  const rendered = renderTemplate(input.templateKey, input.data ?? {});

  try {
    const to = resolveRecipient(customer, input.channel);
    const adapter = adapters[input.channel];
    const result = await adapter({
      to,
      subject: rendered.subject,
      body: rendered.body,
      whatsappTemplateName: rendered.whatsappTemplateName,
    });

    const updated = await prisma.messageLog.update({
      where: { id: log.id },
      data: { status: "SENT", providerId: result.providerId, sentAt: new Date() },
    });

    await recordInteraction(
      input.customerId,
      interactionTypeByChannel[input.channel],
      `Sent ${input.channel.toLowerCase()} "${input.templateKey}"`,
      { channel: input.channel, templateKey: input.templateKey, providerId: result.providerId },
    );

    return updated;
  } catch (error) {
    if (error instanceof AdapterNotConfiguredError) {
      return prisma.messageLog.update({
        where: { id: log.id },
        data: { status: "QUEUED", error: error.message },
      });
    }

    return prisma.messageLog.update({
      where: { id: log.id },
      data: { status: "FAILED", error: error instanceof Error ? error.message : String(error) },
    });
  }
}
