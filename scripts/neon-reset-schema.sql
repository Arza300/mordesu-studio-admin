-- ============================================================
-- سكربت إعادة تهيئة قاعدة بيانات Neon — استخدمه فقط عند البدء من صفر
-- يحذف كل البيانات والمستخدمين والعملاء ثم يعيد إنشاء الجداول
-- لا تشغّل هذا السكربت إذا كنت تريد الاحتفاظ بالبيانات الحالية
-- للتحديثات بدون مسح البيانات استخدم: neon-update-schema-safe.sql
-- ============================================================

BEGIN;

-- 1) حذف الجداول والـ Enum (بالترتيب بسبب الاعتماديات)
DROP TABLE IF EXISTS "Client" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;

-- 2) إنشاء نوع الرتبة: أدمن، متفرج (قيد المراجعة)، مستخدم
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VIEWER', 'USER');

-- 3) جدول المستخدمين — كل حساب جديد يكون متفرج حتى يرفعه الأدمن
CREATE TABLE "User" (
    "id"           TEXT         NOT NULL,
    "email"        TEXT         NOT NULL,
    "name"         TEXT,
    "passwordHash" TEXT         NOT NULL,
    "role"         "Role"       NOT NULL DEFAULT 'VIEWER',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- 4) جدول العملاء (منصات الاستوديو) — مع سعر المميزات والتعديلات
CREATE TABLE "Client" (
    "id"                          TEXT         NOT NULL,
    "name"                        TEXT         NOT NULL,
    "platformName"                TEXT         NOT NULL,
    "phone"                       TEXT         NOT NULL,
    "platformUrl"                 TEXT         NOT NULL,
    "imageUrl"                    TEXT,
    "pricePaid"                   INTEGER      NOT NULL,
    "featuresModificationsPrice"  INTEGER      NOT NULL DEFAULT 0,
    "createdAt"                   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- 5) فهارس لتحسين البحث عن العملاء
CREATE INDEX "Client_name_idx" ON "Client"("name");
CREATE INDEX "Client_platformName_idx" ON "Client"("platformName");
CREATE INDEX "Client_phone_idx" ON "Client"("phone");
CREATE INDEX "Client_platformUrl_idx" ON "Client"("platformUrl");
CREATE INDEX "Client_pricePaid_idx" ON "Client"("pricePaid");

COMMIT;
