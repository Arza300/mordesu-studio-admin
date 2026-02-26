-- إضافة رتبة "متفرج" (VIEWER) لقاعدة موجودة — شغّل مرة واحدة في Neon SQL Editor
-- إذا ظهر خطأ أن VIEWER موجود فعلاً يمكنك تجاهله.

ALTER TYPE "Role" ADD VALUE 'VIEWER';

ALTER TABLE "User"
  ALTER COLUMN "role" SET DEFAULT 'VIEWER';
