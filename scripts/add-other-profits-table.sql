-- جدول أرباح أخرى (سبب الربح + الربح)
-- شغّله في Neon SQL Editor أو استخدم: npx prisma db push

CREATE TABLE IF NOT EXISTS "OtherProfitsEntry" (
  "id"        TEXT       NOT NULL,
  "reason"    TEXT       NOT NULL,
  "profit"    INTEGER    NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OtherProfitsEntry_pkey" PRIMARY KEY ("id")
);
