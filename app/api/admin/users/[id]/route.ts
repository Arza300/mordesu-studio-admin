import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES: Role[] = ["ADMIN", "VIEWER", "USER"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "معرّف المستخدم مطلوب" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, email, role, newPassword } = body as {
      name?: string;
      email?: string;
      role?: string;
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
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: "هذا البريد مستخدم بحساب آخر" },
        { status: 400 },
      );
    }

    const roleValue = ROLES.includes(role as Role) ? (role as Role) : undefined;
    const data: {
      name?: string;
      email?: string;
      role?: Role;
      passwordHash?: string;
    } = {
      name: name?.trim() ?? undefined,
      email: emailTrim.toLowerCase(),
      ...(roleValue && { role: roleValue }),
    };

    if (typeof newPassword === "string" && newPassword.length > 0) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
          { status: 400 },
        );
      }
      data.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }
    console.error("[PATCH /api/admin/users/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث المستخدم" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "معرّف المستخدم مطلوب" }, { status: 400 });
  }

  if (id === admin.id) {
    return NextResponse.json(
      { error: "لا يمكنك حذف حسابك أنت. استخدم تعديل البيانات لتغيير كلمة المرور أو البيانات." },
      { status: 400 },
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }
    console.error("[DELETE /api/admin/users/[id]]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المستخدم" },
      { status: 500 },
    );
  }
}
