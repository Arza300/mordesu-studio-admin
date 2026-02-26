import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "connected" });
  } catch (error) {
    console.error("[GET /api/health]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 },
    );
  }
}
