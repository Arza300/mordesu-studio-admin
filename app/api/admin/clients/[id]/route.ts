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
    return NextResponse.json({ error: "معرّف العميل مطلوب" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      name,
      platformName,
      phone,
      platformUrl,
      pricePaid,
      featuresModificationsPrice,
    } = body as {
      name?: string;
      platformName?: string;
      phone?: string;
      platformUrl?: string;
      pricePaid?: number;
      featuresModificationsPrice?: number;
    };

    if (!name?.trim() || !platformName?.trim() || !phone?.trim() || !platformUrl?.trim()) {
      return NextResponse.json(
        { error: "الاسم، اسم المنصة، الهاتف، ورابط الموقع مطلوبة" },
        { status: 400 },
      );
    }

    const price = typeof pricePaid === "number" ? pricePaid : Number(pricePaid);
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "سعر التكلفة يجب أن يكون رقماً صحيحاً" },
        { status: 400 },
      );
    }
    const featuresPrice =
      typeof featuresModificationsPrice === "number"
        ? featuresModificationsPrice
        : Number(featuresModificationsPrice);
    const featuresPriceRounded =
      Number.isNaN(featuresPrice) || featuresPrice < 0 ? 0 : Math.round(featuresPrice);

    const client = await prisma.client.update({
      where: { id },
      data: {
        name: name.trim(),
        platformName: platformName.trim(),
        phone: phone.trim(),
        platformUrl: platformUrl.trim(),
        pricePaid: Math.round(price),
        featuresModificationsPrice: featuresPriceRounded,
      },
    });

    return NextResponse.json({ ok: true, client }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
    }
    console.error("[PATCH /api/admin/clients/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث العميل" },
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
    return NextResponse.json({ error: "معرّف العميل مطلوب" }, { status: 400 });
  }

  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
    }
    console.error("[DELETE /api/admin/clients/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف العميل" },
      { status: 500 },
    );
  }
}
