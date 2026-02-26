import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 },
      );
    }

    const { registerAdmin } = await import("@/app/lib/auth");
    const user = await registerAdmin({
      name: name?.trim() || undefined,
      email: String(email).trim(),
      password: String(password),
    });

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الحساب";
    console.error("[POST /api/auth/register]", error);

    const isClientError =
      message.includes("البريد مستخدم") ||
      message.includes("البريد الإلكتروني") ||
      message.includes("كلمة المرور");

    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 },
    );
  }
}

