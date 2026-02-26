import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("[GET /api/admin/users]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المستخدمين" },
      { status: 500 },
    );
  }
}
