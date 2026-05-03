-- حقول JSON لحسابات المشروع والاشتراكات
-- شغّل في Neon SQL Editor إذا لم تستخدم prisma db push

ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "projectAccounts" JSONB;
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "subscriptions" JSONB;
