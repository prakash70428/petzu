import { getOrCreateCustomer } from "@/lib/customer";
import { recordInteraction } from "@/lib/crm/activity";
import { fail, ok } from "@/lib/api-response";
import { generateReply } from "@/lib/ai/generate-reply";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// The Anthropic SDK does Node-only work (streaming HTTP with retries) that
// isn't Edge-safe, and every other Prisma-touching route in this build uses
// the Node runtime for the same reason — keeping this consistent.
export const runtime = "nodejs";

const MAX_HISTORY_MESSAGES = 20;

const sendMessageSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
});

function encodeEvent(event: Record<string, unknown>) {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

/** Loads the customer's most recent conversation (if any) and its messages, so reopening the widget shows history instead of starting blank. */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  const parsedEmail = z.string().email().safeParse(email);

  if (!parsedEmail.success) {
    return fail("A valid email query param is required");
  }

  const customer = await getOrCreateCustomer(parsedEmail.data);
  const conversation = await prisma.chatConversation.findFirst({
    where: { customerId: customer.id, channel: "WEB" },
    orderBy: { startedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return ok(conversation ? { conversationId: conversation.id, messages: conversation.messages } : null);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sendMessageSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const { email, message, conversationId } = parsed.data;
  const customer = await getOrCreateCustomer(email);

  const conversation = conversationId
    ? await prisma.chatConversation.findFirst({ where: { id: conversationId, customerId: customer.id } })
    : null;

  const activeConversation =
    conversation ??
    (await prisma.chatConversation.create({ data: { customerId: customer.id, channel: "WEB" } }));

  await prisma.chatMessage.create({
    data: { conversationId: activeConversation.id, role: "USER", content: message },
  });
  await recordInteraction(customer.id, "CHAT_MESSAGE", `Customer: ${message.slice(0, 120)}`, {
    role: "user",
    conversationId: activeConversation.id,
  });

  const priorMessages = await prisma.chatMessage.findMany({
    where: { conversationId: activeConversation.id, role: { in: ["USER", "ASSISTANT"] } },
    orderBy: { createdAt: "asc" },
    take: MAX_HISTORY_MESSAGES,
  });

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encodeEvent({ type: "init", conversationId: activeConversation.id }));

      try {
        const fullText = await generateReply(
          message,
          priorMessages.map((m) => ({ role: m.role as "USER" | "ASSISTANT", content: m.content })),
          (delta) => controller.enqueue(encodeEvent({ type: "delta", text: delta })),
        );

        await prisma.chatMessage.create({
          data: { conversationId: activeConversation.id, role: "ASSISTANT", content: fullText },
        });
        await recordInteraction(customer.id, "CHAT_MESSAGE", `Assistant: ${fullText.slice(0, 120)}`, {
          role: "assistant",
          conversationId: activeConversation.id,
        });

        controller.enqueue(encodeEvent({ type: "done" }));
      } catch (error) {
        const errorMessage = "Sorry, something went wrong answering that. Please try again.";
        controller.enqueue(encodeEvent({ type: "error", message: errorMessage }));
        console.error("Chat completion failed:", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
