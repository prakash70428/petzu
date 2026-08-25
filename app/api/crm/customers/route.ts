import { fail, ok } from "@/lib/api-response";
import { isStaff } from "@/lib/auth/is-staff";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const listQuerySchema = z.object({
  staffEmail: z.string().email(),
  q: z.string().optional(),
});

/** Staff-only customer list, optionally filtered by `q` against email/name. */
export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = listQuerySchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid request");
  }

  if (!isStaff(parsed.data.staffEmail)) {
    return fail("Not authorized", 403);
  }

  const { q } = parsed.data;
  const customers = await prisma.customer.findMany({
    where: q
      ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] }
      : undefined,
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { customerTags: { include: { tag: true } } },
  });

  return ok(
    customers.map((customer) => ({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      createdAt: customer.createdAt,
      tags: customer.customerTags.map((customerTag) => customerTag.tag.name),
    })),
  );
}
