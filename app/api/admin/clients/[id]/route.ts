import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  parseProjectAccountsFromBody,
  parseSubscriptionsFromBody,
  toProjectAccountsPayload,
  toSubscriptionsPayload,
} from "@/app/lib/client-extras";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV === "development";

async function ensureClientColumns(): Promise<void> {
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "featuresModificationsPrice" INTEGER NOT NULL DEFAULT 0',
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "projectAccounts" JSONB',
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "subscriptions" JSONB',
  );
}

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
      projectAccounts?: unknown;
      subscriptions?: unknown;
    };

    try {
      await ensureClientColumns();
    } catch (migrateErr) {
      console.warn("[PATCH /api/admin/clients/[id]] ensure columns:", migrateErr);
    }

    const projectAccountsParsed = parseProjectAccountsFromBody(body.projectAccounts);
    const subscriptionsParsed = parseSubscriptionsFromBody(body.subscriptions);

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

    const updateData = {
      name: name.trim(),
      platformName: platformName.trim(),
      phone: phone.trim(),
      platformUrl: platformUrl.trim(),
      pricePaid: Math.round(price),
      featuresModificationsPrice: featuresPriceRounded,
      projectAccounts: toProjectAccountsPayload(projectAccountsParsed),
      subscriptions: toSubscriptionsPayload(subscriptionsParsed),
    };

    function isMissingColumnError(e: unknown): boolean {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2022") {
        return true;
      }
      let msg = "";
      if (e instanceof Error) {
        msg = e.message;
        const cause = (e as Error & { cause?: unknown }).cause;
        if (cause) msg += ` ${String(cause)}`;
      } else {
        msg = String(e);
      }
      return /does not exist|Unknown column|column .* does not exist|no such column/i.test(msg);
    }

    let client;
    try {
      client = await prisma.client.update({
        where: { id },
        data: updateData,
      });
    } catch (firstErr) {
      const errObj = firstErr as { code?: string };
      if (errObj.code === "P2025") {
        return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
      }
      if (isMissingColumnError(firstErr)) {
        try {
          await ensureClientColumns();
          client = await prisma.client.update({
            where: { id },
            data: updateData,
          });
        } catch (retryErr) {
          console.error("[PATCH /api/admin/clients/[id]] retry after ALTER failed:", retryErr);
          throw retryErr;
        }
      } else {
        throw firstErr;
      }
    }

    try {
      revalidatePath("/dashboard");
    } catch (revErr) {
      console.warn("[PATCH /api/admin/clients/[id]] revalidatePath:", revErr);
    }

    return NextResponse.json({ ok: true, client }, { status: 200 });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error("[PATCH /api/admin/clients/[id]]", error);
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء تحديث العميل",
        ...(isDev && { detail: message }),
      },
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
