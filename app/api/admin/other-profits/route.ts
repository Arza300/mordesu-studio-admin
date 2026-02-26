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
    const entries = await prisma.otherProfitsEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.otherProfitsEntry.aggregate({
      _sum: { profit: true },
    });
    return NextResponse.json({
      entries,
      totalProfit: total._sum.profit ?? 0,
    });
  } catch (error) {
    console.error("[GET /api/admin/other-profits]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الأرباح الأخرى" },
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
    const { reason, profit } = (body || {}) as {
      reason?: string;
      profit?: number;
    };

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: "سبب الربح مطلوب" },
        { status: 400 },
      );
    }

    const profitNum = typeof profit === "number" ? profit : Number(profit);
    if (Number.isNaN(profitNum) || profitNum < 0) {
      return NextResponse.json(
        { error: "الربح يجب أن يكون رقماً غير سالب" },
        { status: 400 },
      );
    }

    const entry = await prisma.otherProfitsEntry.create({
      data: {
        reason: reason.trim(),
        profit: Math.round(profitNum),
      },
    });

    return NextResponse.json({ ok: true, entry }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/other-profits]", error);
    const message = isTableMissingError(error)
      ? "جدول الأرباح الأخرى غير موجود. من مجلد المشروع شغّل: npx prisma db push"
      : "حدث خطأ أثناء إضافة الربح";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
