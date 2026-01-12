// lib/prisma.ts
import { PrismaClient } from "./generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL || "";
const connectionString = databaseUrl.includes("?")
  ? `${databaseUrl}&connection_limit=20&pool_timeout=30`
  : `${databaseUrl}?connection_limit=20&pool_timeout=30`;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });
