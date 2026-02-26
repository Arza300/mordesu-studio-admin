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
    const entries = await prisma.studioCollaboration.findMany({
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.studioCollaboration.aggregate({
      _sum: { monetaryBenefit: true },
    });
    return NextResponse.json({
      entries,
      totalProfit: total._sum.monetaryBenefit ?? 0,
    });
  } catch (error) {
    console.error("[GET /api/admin/collaborations]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب تعاونات الاستوديو" },
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
    const { description, monetaryBenefit } = (body || {}) as {
      description?: string;
      monetaryBenefit?: number;
    };

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "وصف التعاون مطلوب" },
        { status: 400 },
      );
    }

    const benefitNum = typeof monetaryBenefit === "number" ? monetaryBenefit : Number(monetaryBenefit);
    if (Number.isNaN(benefitNum) || benefitNum < 0) {
      return NextResponse.json(
        { error: "الربح العائد يجب أن يكون رقماً غير سالب" },
        { status: 400 },
      );
    }

    const entry = await prisma.studioCollaboration.create({
      data: {
        description: description.trim(),
        monetaryBenefit: Math.round(benefitNum),
      },
    });

    return NextResponse.json({ ok: true, entry }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/collaborations]", error);
    const message = isTableMissingError(error)
      ? "جدول تعاونات الاستوديو غير موجود. من مجلد المشروع شغّل: npx prisma db push"
      : "حدث خطأ أثناء إضافة التعاون";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
