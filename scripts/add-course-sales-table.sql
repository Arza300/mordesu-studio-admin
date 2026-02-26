-- جدول أرباح بيع الكورسات (اسم المنصة + الأرباح)
-- شغّله في Neon SQL Editor أو استخدم: npx prisma db push

CREATE TABLE IF NOT EXISTS "CourseSalesEntry" (
  "id"           TEXT       NOT NULL,
  "platformName" TEXT       NOT NULL,
  "profits"      INTEGER    NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CourseSalesEntry_pkey" PRIMARY KEY ("id")
);
