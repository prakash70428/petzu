import type { Prisma } from "@prisma/client";
import { BOOKING_SUBJECT_PREFIX } from "@/lib/admin/constants";
import { fail } from "@/lib/api-response";
import { staffSession } from "@/lib/auth/admin-session";
import { toCsv, type CsvValue } from "@/lib/csv";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface Table {
  columns: string[];
  rows: CsvValue[][];
}

async function feedbackTable(where: Prisma.FeedbackWhereInput): Promise<Table> {
  const items = await prisma.feedback.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { customer: { select: { email: true, name: true } } },
  });
  return {
    columns: ["created_at", "type", "status", "subject", "message", "name", "email", "resolved_at"],
    rows: items.map((f) => [f.createdAt, f.type, f.status, f.subject, f.body, f.customer?.name, f.customer?.email, f.resolvedAt]),
  };
}

/**
 * Everything the business owns, as CSV (opens in Excel and Google Sheets)
 * or JSON: the data-portability promise in the proposal, without needing
 * database access. Staff only.
 */
const exporters: Record<string, () => Promise<Table>> = {
  customers: async () => {
    const rows = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
    return { columns: ["email", "name", "phone", "created_at"], rows: rows.map((c) => [c.email, c.name, c.phone, c.createdAt]) };
  },
  enquiries: () => feedbackTable({ NOT: { subject: { startsWith: BOOKING_SUBJECT_PREFIX } } }),
  bookings: () => feedbackTable({ subject: { startsWith: BOOKING_SUBJECT_PREFIX } }),
  community: async () => {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { email: true } }, _count: { select: { replies: true } } },
    });
    return {
      columns: ["created_at", "author", "email", "animal", "topic", "question", "details", "answers", "hidden"],
      rows: posts.map((p) => [p.createdAt, p.authorName, p.customer.email, p.species, p.topic, p.title, p.body, p._count.replies, p.hidden]),
    };
  },
  community_answers: async () => {
    const replies = await prisma.communityReply.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { email: true } }, post: { select: { title: true } } },
    });
    return {
      columns: ["created_at", "question", "author", "email", "answer", "hidden"],
      rows: replies.map((r) => [r.createdAt, r.post.title, r.authorName, r.customer.email, r.body, r.hidden]),
    };
  },
  chats: async () => {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: "asc" },
      include: { conversation: { select: { id: true, channel: true, customer: { select: { email: true, name: true } } } } },
    });
    return {
      columns: ["created_at", "conversation", "channel", "customer_email", "customer_name", "from", "message"],
      rows: messages.map((m) => [
        m.createdAt,
        m.conversation.id,
        m.conversation.channel,
        m.conversation.customer?.email,
        m.conversation.customer?.name,
        m.role === "USER" ? "customer" : "assistant",
        m.content,
      ]),
    };
  },
  newsletter: async () => {
    const consents = await prisma.consent.findMany({
      where: { channel: "EMAIL", purpose: "MARKETING", granted: true },
      include: { customer: { select: { email: true, name: true } } },
    });
    return { columns: ["email", "name", "source", "updated_at"], rows: consents.map((c) => [c.customer.email, c.customer.name, c.source, c.updatedAt]) };
  },
  consents: async () => {
    const consents = await prisma.consent.findMany({ include: { customer: { select: { email: true } } } });
    return {
      columns: ["email", "channel", "purpose", "granted", "source", "updated_at"],
      rows: consents.map((c) => [c.customer.email, c.channel, c.purpose, c.granted, c.source, c.updatedAt]),
    };
  },
  messages_sent: async () => {
    const logs = await prisma.messageLog.findMany({ orderBy: { createdAt: "desc" }, include: { customer: { select: { email: true } } } });
    return {
      columns: ["created_at", "email", "channel", "purpose", "template", "status", "error"],
      rows: logs.map((l) => [l.createdAt, l.customer.email, l.channel, l.purpose, l.templateKey, l.status, l.error]),
    };
  },
};

export async function GET(request: Request) {
  if (!staffSession(request)) return fail("Not authorized", 403);

  const params = new URL(request.url).searchParams;
  const name = params.get("data") ?? "";
  const format = params.get("format") === "json" ? "json" : "csv";
  const exporter = Object.hasOwn(exporters, name) ? exporters[name] : undefined;
  if (!exporter) return fail("Unknown export", 404);

  const table = await exporter();
  const filename = `petzu-${name}-${new Date().toISOString().slice(0, 10)}.${format}`;
  const body =
    format === "json"
      ? JSON.stringify(
          table.rows.map((row) =>
            Object.fromEntries(table.columns.map((column, i) => [column, row[i] instanceof Date ? (row[i] as Date).toISOString() : (row[i] ?? null)])),
          ),
          null,
          2,
        )
      : toCsv(table.columns, table.rows);

  return new Response(body, {
    headers: {
      "Content-Type": format === "json" ? "application/json; charset=utf-8" : "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
