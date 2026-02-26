-- جدول أرباح منصة صناع (مشاهدات + تعاونات)
-- شغّله في Neon SQL Editor أو استخدم: npx prisma db push

CREATE TABLE IF NOT EXISTS "SanaaEarningsEntry" (
  "id"                   TEXT       NOT NULL,
  "viewsAmount"          INTEGER    NOT NULL DEFAULT 0,
  "collaborationsAmount" INTEGER    NOT NULL DEFAULT 0,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SanaaEarningsEntry_pkey" PRIMARY KEY ("id")
);
