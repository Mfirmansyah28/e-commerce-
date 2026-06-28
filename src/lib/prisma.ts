import { PrismaClient } from "@prisma/client";

// Best practice Next.js: simpan instance Prisma di global object saat development
// supaya hot-reload nggak bikin koneksi database baru terus-terusan (bisa exhaust connection limit).

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
