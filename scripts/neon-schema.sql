-- ============================================================
-- سكربت Neon — تحديث آمن (لا يحذف أي بيانات ولا أي مستخدمين)
-- شغّله في Neon SQL Editor بعد اختيار قاعدة neondb
-- ============================================================

ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "featuresModificationsPrice" INTEGER NOT NULL DEFAULT 0;
