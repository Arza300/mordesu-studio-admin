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
    const entries = await prisma.courseSalesEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.courseSalesEntry.aggregate({
      _sum: { profits: true },
    });
    return NextResponse.json({
      entries,
      totalProfits: total._sum.profits ?? 0,
    });
  } catch (error) {
    console.error("[GET /api/admin/course-sales]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب أرباح الكورسات" },
      { status: 500 },
    );
  }
}

function isTableMissingError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string })?.code;
  return (
    code === "P2021" ||
    code === "P1014" ||
    /does not exist|جدول|table/i.test(msg)
  );
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "بيانات الطلب غير صالحة" },
        { status: 400 },
      );
    }
    const { platformName, profits } = (body || {}) as {
      platformName?: string;
      profits?: number;
    };

    if (!platformName?.trim()) {
      return NextResponse.json(
        { error: "اسم المنصة مطلوب" },
        { status: 400 },
      );
    }

    const profitsNum = typeof profits === "number" ? profits : Number(profits);
    if (Number.isNaN(profitsNum) || profitsNum < 0) {
      return NextResponse.json(
        { error: "الأرباح يجب أن تكون رقماً غير سالب" },
        { status: 400 },
      );
    }

    const entry = await prisma.courseSalesEntry.create({
      data: {
        platformName: platformName.trim(),
        profits: Math.round(profitsNum),
      },
    });

    return NextResponse.json({ ok: true, entry }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/course-sales]", error);
    const message = isTableMissingError(error)
      ? "جدول أرباح الكورسات غير موجود. من مجلد المشروع شغّل: npx prisma db push"
      : "حدث خطأ أثناء إضافة الأرباح";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
