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

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { viewsAmount, collaborationsAmount } = body as {
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
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة الأرباح" },
      { status: 500 },
    );
  }
}
