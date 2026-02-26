import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "بيانات الطلب غير صالحة" },
        { status: 400 },
      );
    }
    const { name, email, newPassword } = (body || {}) as {
      name?: string;
      email?: string;
      newPassword?: string;
    };

    const emailTrim = email?.trim();
    if (!emailTrim) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: emailTrim.toLowerCase() },
    });
    if (existing && existing.id !== admin.id) {
      return NextResponse.json(
        { error: "هذا البريد مستخدم بحساب آخر" },
        { status: 400 },
      );
    }

    const data: { name?: string; email?: string; passwordHash?: string } = {
      name: name?.trim() ?? undefined,
      email: emailTrim.toLowerCase(),
    };

    if (typeof newPassword === "string" && newPassword.length > 0) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" },
          { status: 400 },
        );
      }
      data.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const user = await prisma.user.update({
      where: { id: admin.id },
      data,
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("[PATCH /api/admin/me]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث البيانات" },
      { status: 500 },
    );
  }
}
