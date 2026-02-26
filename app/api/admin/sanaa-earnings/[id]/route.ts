import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "معرّف السجل مطلوب" }, { status: 400 });
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

    const entry = await prisma.sanaaEarningsEntry.update({
      where: { id },
      data: {
        viewsAmount: Math.round(views),
        collaborationsAmount: Math.round(collab),
      },
    });

    return NextResponse.json({ ok: true, entry }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }
    console.error("[PATCH /api/admin/sanaa-earnings/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث السجل" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "معرّف السجل مطلوب" }, { status: 400 });
  }

  try {
    await prisma.sanaaEarningsEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }
    console.error("[DELETE /api/admin/sanaa-earnings/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف السجل" },
      { status: 500 },
    );
  }
}
