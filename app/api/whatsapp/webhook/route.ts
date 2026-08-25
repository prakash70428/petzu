import { getAnthropicClient } from "@/lib/ai/anthropic-client";
import { generateReply } from "@/lib/ai/generate-reply";
import { recordInteraction } from "@/lib/crm/activity";
import {
  parseWebhookPayload,
  sendWhatsAppSessionReply,
  verifyWebhookSignature,
} from "@/lib/comms/adapters/whatsapp-meta";
import { prisma } from "@/lib/prisma";
import type { InboundWhatsAppMessage } from "@/lib/comms/adapters/whatsapp-meta";

export const runtime = "nodejs";

const MAX_HISTORY_MESSAGES = 20;

/**
 * Meta's one-time webhook verification handshake, run when you register
 * this URL in the Meta App dashboard (WhatsApp → Configuration → Webhook).
 * Meta calls this with `hub.verify_token` and expects the exact
 * `hub.challenge` value echoed back if the token matches
 * `WHATSAPP_WEBHOOK_VERIFY_TOKEN` — anything else and it refuses to save
 * the webhook URL.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && verifyToken && token === verifyToken && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

/**
 * Handles inbound WhatsApp messages: resolves (or creates) a conversation
 * for the sending number, saves the message, generates a reply via Phase
 * 3's chatbot (grounded in the Phase 2 knowledge base), and sends it back
 * as a free-form session reply — not through Phase 5's consent-gated
 * dispatcher, since a reply to an inbound message doesn't need it (see
 * `sendWhatsAppSessionReply`'s doc comment).
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const messages = parseWebhookPayload(payload);

  // Always 200 once the signature checks out — Meta retries on non-2xx,
  // and a transient failure handling one message shouldn't cause Meta to
  // resend the whole batch.
  for (const message of messages) {
    try {
      await handleInboundMessage(message);
    } catch (error) {
      console.error("Failed to handle inbound WhatsApp message:", error);
    }
  }

  return new Response("OK", { status: 200 });
}

async function handleInboundMessage(message: InboundWhatsAppMessage) {
  const customer = await prisma.customer.findFirst({ where: { phone: message.from } });

  const conversation =
    (await prisma.chatConversation.findFirst({
      where: { whatsappPhone: message.from, channel: "WHATSAPP" },
      orderBy: { startedAt: "desc" },
    })) ??
    (await prisma.chatConversation.create({
      data: { customerId: customer?.id, channel: "WHATSAPP", whatsappPhone: message.from },
    }));

  await prisma.chatMessage.create({
    data: { conversationId: conversation.id, role: "USER", content: message.text },
  });

  // Only a resolved Customer has anywhere to log an interaction — an
  // unrecognized number still gets a full chatbot reply, it just doesn't
  // show up on any customer's CRM timeline until that number is linked to
  // an account. See "The phone-only identity gap" in PHASE-2-6-WHATSAPP.md.
  if (customer) {
    await recordInteraction(customer.id, "WHATSAPP_MESSAGE", `Customer via WhatsApp: ${message.text.slice(0, 120)}`, {
      direction: "inbound",
      conversationId: conversation.id,
    });
  }

  const priorMessages = await prisma.chatMessage.findMany({
    where: { conversationId: conversation.id, role: { in: ["USER", "ASSISTANT"] } },
    orderBy: { createdAt: "asc" },
    take: MAX_HISTORY_MESSAGES,
  });

  const replyText = await generateReply(
    message.text,
    priorMessages.map((m) => ({ role: m.role as "USER" | "ASSISTANT", content: m.content })),
  );

  await prisma.chatMessage.create({
    data: { conversationId: conversation.id, role: "ASSISTANT", content: replyText },
  });

  if (customer) {
    await recordInteraction(customer.id, "WHATSAPP_MESSAGE", `Assistant via WhatsApp: ${replyText.slice(0, 120)}`, {
      direction: "outbound",
      conversationId: conversation.id,
    });
  }

  // getAnthropicClient() being null means generateReply() already returned
  // the "not configured" message — still worth sending back over WhatsApp
  // so a real tester sees *something*, rather than silently doing nothing.
  if (!getAnthropicClient()) {
    console.warn("ANTHROPIC_API_KEY not set — sent the fallback message instead of a real reply.");
  }

  try {
    await sendWhatsAppSessionReply(message.from, replyText);
  } catch (error) {
    console.error("Failed to send WhatsApp reply:", error);
  }
}
