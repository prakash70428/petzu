import { PrismaClient } from "@prisma/client";

/**
 * Next.js dev mode hot-reloads modules on every save, which would create a
 * fresh `PrismaClient` (and a fresh DB connection pool) on every edit if we
 * just did `export const prisma = new PrismaClient()`. Stashing the
 * instance on `globalThis` survives the module reload, so dev keeps reusing
 * one client. In production each server instance still gets exactly one.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
