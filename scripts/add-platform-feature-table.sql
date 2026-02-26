-- إنشاء جدول أسعار المميزات والتعديلات في المنصة
-- شغّل هذا السكربت في Neon Console إذا لم تستخدم prisma db push

CREATE TABLE IF NOT EXISTS "PlatformFeature" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PlatformFeature_pkey" PRIMARY KEY ("id")
);
