# نشر المشروع على Vercel — حل 404 NOT_FOUND

## 1. مجلد الجذر (Root Directory) — الأهم

- إذا كان الريبو يحتوي على **مجلد واحد** فقط (مثل `mordesu-studio-admin`) وملف `package.json` في جذر الريبو:
  - اترك **Root Directory** في Vercel **فارغاً**.

- إذا كان الريبو يحتوي على **عدة مجلدات** (مثل مجلد `1` أو `main` وفيه بداخله `mordesu-studio-admin`):
  1. Vercel → مشروعك → **Settings** → **General**
  2. **Root Directory** → **Edit**
  3. اكتب المسار حتى مجلد المشروع، مثلاً: **`mordesu-studio-admin`**
  4. **Save**
  5. من **Deployments** → **Redeploy** لأحدث نشر

## 2. متغيرات البيئة (Environment Variables)

في **Settings** → **Environment Variables** أضف:

| الاسم            | القيمة                    | البيئة    |
|------------------|---------------------------|-----------|
| `DATABASE_URL`   | رابط Neon من لوحة Neon   | Production (و Preview إن أردت) |
| `AUTH_SECRET`    | سلسلة عشوائية طويلة      | Production (و Preview إن أردت) |

ثم احفظ وأعد النشر.

## 3. التحقق من البناء (Build)

1. من **Deployments** اختر آخر نشر.
2. اضغط على **Building** وافتح الـ **Build Logs**.
3. إذا ظهر **Build failed**:
   - انسخ رسالة الخطأ.
   - تأكد أن **Root Directory** مضبوط كما في الخطوة 1.
   - تأكد أن **Node.js** 18 أو أحدث (المشروع يحدد `engines.node": ">=18"`).

## 4. بعد التعديلات

- عدّلت في المشروع:
  - `vercel.json`: أمر البناء يتضمن `prisma generate` ثم `next build`.
  - `package.json`: حقل `engines.node` لاستخدام Node 18+.
- ارفع التعديلات (commit + push) ثم انتظر إعادة النشر، أو اعمل **Redeploy** من لوحة Vercel.

إذا استمر 404 بعد تطبيق الخطوة 1 و 2 وإعادة النشر، أرسل لقطة من **Build Logs** (قسم البناء) لآخر نشر.
