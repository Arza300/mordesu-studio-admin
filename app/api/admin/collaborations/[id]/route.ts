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
    const { description, monetaryBenefit } = body as {
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

    const entry = await prisma.studioCollaboration.update({
      where: { id },
      data: {
        description: description.trim(),
        monetaryBenefit: Math.round(benefitNum),
      },
    });

    return NextResponse.json({ ok: true, entry }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }
    console.error("[PATCH /api/admin/collaborations/[id]]", error);
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
    await prisma.studioCollaboration.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }
    console.error("[DELETE /api/admin/collaborations/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف السجل" },
      { status: 500 },
    );
  }
}
