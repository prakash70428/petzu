import { fail, ok } from "@/lib/api-response";
import { staffSession } from "@/lib/auth/admin-session";
import { BOOKING_SUBJECT_PREFIX } from "@/lib/admin/constants";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Headline numbers and the latest items for the admin overview. */
export async function GET(request: Request) {
  if (!staffSession(request)) return fail("Not authorized", 403);

  const weekAgo = new Date(Date.now() - 7 * 864e5);
  const open = { in: ["OPEN", "IN_PROGRESS"] as ("OPEN" | "IN_PROGRESS")[] };

  const [
    customers,
    customersThisWeek,
    openEnquiries,
    openBookings,
    openPartners,
    openComplaints,
    posts,
    postsThisWeek,
    replies,
    chats,
    chatsThisWeek,
    subscribers,
    latest,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.feedback.count({ where: { type: "ENQUIRY", status: open, NOT: { subject: { startsWith: BOOKING_SUBJECT_PREFIX } } } }),
    prisma.feedback.count({ where: { type: "ENQUIRY", status: open, subject: { startsWith: BOOKING_SUBJECT_PREFIX } } }),
    prisma.feedback.count({ where: { type: "PARTNERSHIP", status: open } }),
    prisma.feedback.count({ where: { type: "COMPLAINT", status: open } }),
    prisma.communityPost.count({ where: { hidden: false } }),
    prisma.communityPost.count({ where: { hidden: false, createdAt: { gte: weekAgo } } }),
    prisma.communityReply.count({ where: { hidden: false } }),
    prisma.chatConversation.count(),
    prisma.chatConversation.count({ where: { startedAt: { gte: weekAgo } } }),
    prisma.consent.count({ where: { channel: "EMAIL", purpose: "MARKETING", granted: true } }),
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, type: true, status: true, subject: true, createdAt: true, customer: { select: { email: true, name: true } } },
    }),
  ]);

  return ok({
    customers: { total: customers, thisWeek: customersThisWeek },
    open: { enquiries: openEnquiries, bookings: openBookings, partners: openPartners, complaints: openComplaints },
    community: { posts, postsThisWeek, replies },
    chats: { total: chats, thisWeek: chatsThisWeek },
    subscribers,
    latest,
  });
}
