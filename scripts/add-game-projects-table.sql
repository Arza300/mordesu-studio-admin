-- إضافة جدول مشاريع الألعاب (Unreal Engine 5) ونوع المشروع
-- شغّله في Neon SQL Editor إذا لم تستخدم prisma db push

CREATE TYPE "ProjectType" AS ENUM ('PRIVATE', 'INVESTOR');

CREATE TABLE IF NOT EXISTS "GameProject" (
  "id"          TEXT         NOT NULL,
  "name"        TEXT         NOT NULL,
  "profits"     INTEGER      NOT NULL,
  "projectType" "ProjectType" NOT NULL,
  "projectLink" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GameProject_pkey" PRIMARY KEY ("id")
);

-- إذا الجدول موجود مسبقاً بدون projectLink، شغّل:
-- ALTER TABLE "GameProject" ADD COLUMN IF NOT EXISTS "projectLink" TEXT;
