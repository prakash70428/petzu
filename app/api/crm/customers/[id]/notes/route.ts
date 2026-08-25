import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { recordInteraction } from "@/lib/crm/activity";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const addNoteSchema = z.object({
  staffEmail: z.string().email(),
  body: z.string().min(1),
});

/** Adds a staff note and mirrors it onto the Interaction timeline (type NOTE_ADDED) so it appears inline with everything else. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = addNoteSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  const { staffEmail, body: noteBody } = parsed.data;

  const note = await prisma.note.create({
    data: { customerId: id, authorEmail: staffEmail, body: noteBody },
  });

  await recordInteraction(id, "NOTE_ADDED", `Note by ${staffEmail}: ${noteBody.slice(0, 120)}`, { authorEmail: staffEmail });

  return ok(note, 201);
}
