import { getOrCreateCustomer } from "@/lib/customer";
import { recordInteraction } from "@/lib/crm/activity";
import { fail, ok } from "@/lib/api-response";
import { generateReply, type ChatTurn } from "@/lib/ai/generate-reply";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// The Anthropic SDK does Node-only work (streaming HTTP with retries) that
// isn't Edge-safe, and every other Prisma-touching route in this build uses
// the Node runtime for the same reason — keeping this consistent.
export const runtime = "nodejs";

const MAX_HISTORY_MESSAGES = 20;

const sendMessageSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(80).optional(),
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

  try {
    const customer = await getOrCreateCustomer(parsedEmail.data);
    const conversation = await prisma.chatConversation.findFirst({
      where: { customerId: customer.id, channel: "WEB" },
      orderBy: { startedAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    return ok(conversation ? { conversationId: conversation.id, messages: conversation.messages } : null);
  } catch (error) {
    // No history is better than a broken widget.
    console.error("Chat history unavailable:", error);
    return ok(null);
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sendMessageSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const { email, name, message, conversationId } = parsed.data;

  // Saving the chat is best-effort: if the database is down, the person
  // still gets an answer (without history) instead of a silent failure.
  let saved: { customerId: string; conversationId: string } | null = null;
  let priorMessages: ChatTurn[] = [{ role: "USER", content: message }];
  try {
    const existing = await getOrCreateCustomer(email);
    // The email is unverified (guests type it into the widget), so a name is
    // only ever filled in, never overwritten: typing someone else's email
    // must not rename their customer record.
    const customer =
      name && !existing.name
        ? await prisma.customer.update({ where: { id: existing.id }, data: { name } })
        : existing;

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

    const history = await prisma.chatMessage.findMany({
      where: { conversationId: activeConversation.id, role: { in: ["USER", "ASSISTANT"] } },
      orderBy: { createdAt: "asc" },
      take: MAX_HISTORY_MESSAGES,
    });
    priorMessages = history.map((m) => ({ role: m.role as ChatTurn["role"], content: m.content }));
    saved = { customerId: customer.id, conversationId: activeConversation.id };
  } catch (error) {
    console.error("Chat history unavailable, answering without it:", error);
  }

  const stream = new ReadableStream({
    async start(controller) {
      if (saved) controller.enqueue(encodeEvent({ type: "init", conversationId: saved.conversationId }));

      try {
        const fullText = await generateReply(message, priorMessages, (delta) =>
          controller.enqueue(encodeEvent({ type: "delta", text: delta })),
        );

        if (saved) {
          const { customerId, conversationId: savedConversationId } = saved;
          await prisma.chatMessage
            .create({ data: { conversationId: savedConversationId, role: "ASSISTANT", content: fullText } })
            .then(() =>
              recordInteraction(customerId, "CHAT_MESSAGE", `Assistant: ${fullText.slice(0, 120)}`, {
                role: "assistant",
                conversationId: savedConversationId,
              }),
            )
            .catch((error) => console.error("Saving the assistant reply failed:", error));
        }

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
