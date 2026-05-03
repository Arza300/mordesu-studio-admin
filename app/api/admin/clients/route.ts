import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  parseProjectAccountsFromBody,
  parseSubscriptionsFromBody,
  toProjectAccountsPayload,
  toSubscriptionsPayload,
} from "@/app/lib/client-extras";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV === "development";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      name,
      platformName,
      phone,
      platformUrl,
      imageUrl,
      pricePaid,
      featuresModificationsPrice,
    } = body as {
      name?: string;
      platformName?: string;
      phone?: string;
      platformUrl?: string;
      imageUrl?: string | null;
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

    const nameVal = name.trim();
    const platformNameVal = platformName.trim();
    const phoneVal = phone.trim();
    const platformUrlVal = platformUrl.trim();
    const imageUrlVal = imageUrl?.trim() || null;
    const pricePaidVal = Math.round(price);

    const projectAccountsParsed = parseProjectAccountsFromBody(
      (body as { projectAccounts?: unknown }).projectAccounts,
    );
    const subscriptionsParsed = parseSubscriptionsFromBody(
      (body as { subscriptions?: unknown }).subscriptions,
    );
    const projectAccountsVal = toProjectAccountsPayload(projectAccountsParsed);
    const subscriptionsVal = toSubscriptionsPayload(subscriptionsParsed);

    // التأكد من وجود الأعمدة المطلوبة في الجدول
    try {
      await prisma.$executeRawUnsafe(
        'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "featuresModificationsPrice" INTEGER NOT NULL DEFAULT 0',
      );
      await prisma.$executeRawUnsafe(
        'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "projectAccounts" JSONB',
      );
      await prisma.$executeRawUnsafe(
        'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "subscriptions" JSONB',
      );
    } catch (alterErr) {
      console.warn("[POST /api/admin/clients] ALTER TABLE (optional):", alterErr);
    }

    let client: {
      id: string;
      name: string;
      platformName: string;
      phone: string;
      platformUrl: string;
      imageUrl: string | null;
      pricePaid: number;
      featuresModificationsPrice: number;
      projectAccounts: unknown;
      subscriptions: unknown;
      createdAt: Date;
    } | null = null;

    try {
      client = await prisma.client.create({
        data: {
          name: nameVal,
          platformName: platformNameVal,
          phone: phoneVal,
          platformUrl: platformUrlVal,
          imageUrl: imageUrlVal,
          pricePaid: pricePaidVal,
          featuresModificationsPrice: featuresPriceRounded,
          projectAccounts: projectAccountsVal,
          subscriptions: subscriptionsVal,
        },
      });
    } catch (createErr) {
      const errMsg = createErr instanceof Error ? createErr.message : String(createErr);
      console.error("[POST /api/admin/clients] prisma.client.create failed:", errMsg);

      const missingColumn =
        /featuresModificationsPrice|projectAccounts|subscriptions|column.*does not exist|does not exist/i.test(
          errMsg,
        );

      if (missingColumn) {
        const id = randomUUID();
        const insertWithColumn = async () => {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "Client" ("id", "name", "platformName", "phone", "platformUrl", "imageUrl", "pricePaid", "featuresModificationsPrice", "projectAccounts", "subscriptions", "createdAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, NOW())`,
            id,
            nameVal,
            platformNameVal,
            phoneVal,
            platformUrlVal,
            imageUrlVal,
            pricePaidVal,
            featuresPriceRounded,
            JSON.stringify(projectAccountsVal),
            JSON.stringify(subscriptionsVal),
          );
        };
        try {
          await insertWithColumn();
        } catch (rawErr) {
          const rawMsg = rawErr instanceof Error ? rawErr.message : String(rawErr);
          if (/column.*does not exist|featuresModificationsPrice|projectAccounts|subscriptions/i.test(rawMsg)) {
            await prisma.$executeRawUnsafe(
              'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "featuresModificationsPrice" INTEGER NOT NULL DEFAULT 0',
            );
            await prisma.$executeRawUnsafe(
              'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "projectAccounts" JSONB',
            );
            await prisma.$executeRawUnsafe(
              'ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "subscriptions" JSONB',
            );
            try {
              await insertWithColumn();
            } catch (retryErr) {
              const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
              if (
                /column.*does not exist|featuresModificationsPrice|projectAccounts|subscriptions/i.test(
                  retryMsg,
                )
              ) {
                try {
                  await prisma.$executeRawUnsafe(
                    `INSERT INTO "Client" ("id", "name", "platformName", "phone", "platformUrl", "imageUrl", "pricePaid", "featuresModificationsPrice", "projectAccounts", "subscriptions", "createdAt")
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, NOW())`,
                    id,
                    nameVal,
                    platformNameVal,
                    phoneVal,
                    platformUrlVal,
                    imageUrlVal,
                    pricePaidVal,
                    featuresPriceRounded,
                    JSON.stringify(projectAccountsVal),
                    JSON.stringify(subscriptionsVal),
                  );
                } catch (insertWithoutCol) {
                  const msg = insertWithoutCol instanceof Error ? insertWithoutCol.message : String(insertWithoutCol);
                  console.error("[POST /api/admin/clients] raw INSERT (full row) failed:", msg);
                  return NextResponse.json(
                    {
                      error:
                        "قاعدة البيانات تحتاج تحديثاً. نفّذ في Neon SQL Editor السكربت scripts/add-client-project-subscriptions.sql ثم أعد المحاولة.",
                      ...(isDev && { detail: msg }),
                    },
                    { status: 500 },
                  );
                }
              } else {
                throw retryErr;
              }
            }
          } else {
            console.error("[POST /api/admin/clients] raw INSERT failed:", rawMsg);
            throw rawErr;
          }
        }
        const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
          `SELECT * FROM "Client" WHERE "id" = $1`,
          id,
        );
        const row = rows[0];
        if (row) {
          const rawFeatures = row.featuresModificationsPrice ?? (row as Record<string, unknown>).featuresmodificationsprice;
          client = {
            id: row.id as string,
            name: row.name as string,
            platformName: row.platformName as string,
            phone: row.phone as string,
            platformUrl: row.platformUrl as string,
            imageUrl: (row.imageUrl as string | null) ?? null,
            pricePaid: Number(row.pricePaid),
            featuresModificationsPrice: Number(rawFeatures ?? 0),
            projectAccounts: row.projectAccounts ?? null,
            subscriptions: row.subscriptions ?? null,
            createdAt: row.createdAt as Date,
          };
        }
      }

      if (!client) throw createErr;
    }

    if (!client) {
      return NextResponse.json(
        { error: "حدث خطأ أثناء إضافة العميل" },
        { status: 500 },
      );
    }

    revalidatePath("/dashboard");
    return NextResponse.json({ ok: true, client }, { status: 201 });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[POST /api/admin/clients]", err.message, err.stack);
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء إضافة العميل",
        ...(isDev && { detail: err.message }),
      },
      { status: 500 },
    );
  }
}
