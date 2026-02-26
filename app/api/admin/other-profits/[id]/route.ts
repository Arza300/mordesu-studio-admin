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
    const { reason, profit } = body as {
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

    const entry = await prisma.otherProfitsEntry.update({
      where: { id },
      data: {
        reason: reason.trim(),
        profit: Math.round(profitNum),
      },
    });

    return NextResponse.json({ ok: true, entry }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }
    console.error("[PATCH /api/admin/other-profits/[id]]", error);
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
    await prisma.otherProfitsEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }
    console.error("[DELETE /api/admin/other-profits/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف السجل" },
      { status: 500 },
    );
  }
}
