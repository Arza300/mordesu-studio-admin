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
    const entries = await prisma.sanaaEarningsEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
    const aggregate = await prisma.sanaaEarningsEntry.aggregate({
      _sum: { viewsAmount: true, collaborationsAmount: true },
    });
    return NextResponse.json({
      entries,
      totalViews: aggregate._sum.viewsAmount ?? 0,
      totalCollaborations: aggregate._sum.collaborationsAmount ?? 0,
    });
  } catch (error) {
    console.error("[GET /api/admin/sanaa-earnings]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب أرباح المنصة" },
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
    const { viewsAmount, collaborationsAmount } = (body || {}) as {
      viewsAmount?: number;
      collaborationsAmount?: number;
    };

    const views = typeof viewsAmount === "number" ? viewsAmount : Number(viewsAmount);
    const collab = typeof collaborationsAmount === "number" ? collaborationsAmount : Number(collaborationsAmount);

    if (Number.isNaN(views) || views < 0 || Number.isNaN(collab) || collab < 0) {
      return NextResponse.json(
        { error: "المبالغ يجب أن تكون أرقاماً غير سالبة" },
        { status: 400 },
      );
    }

    const entry = await prisma.sanaaEarningsEntry.create({
      data: {
        viewsAmount: Math.round(views),
        collaborationsAmount: Math.round(collab),
      },
    });

    return NextResponse.json({ ok: true, entry }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/sanaa-earnings]", error);
    const message = isTableMissingError(error)
      ? "جدول أرباح منصة صناع غير موجود. من مجلد المشروع شغّل: npx prisma db push"
      : "حدث خطأ أثناء إضافة الأرباح";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
