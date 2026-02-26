-- إضافة عمود سعر المميزات والتعديلات لجدول العملاء
-- شغّل هذا السكربت في Neon Console إذا لم تستخدم prisma db push

ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "featuresModificationsPrice" INTEGER NOT NULL DEFAULT 0;
