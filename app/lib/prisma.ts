import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  neonConfig.webSocketConstructor = ws;
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
}

export const prisma = global.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

