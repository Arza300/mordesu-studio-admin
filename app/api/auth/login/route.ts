import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 },
      );
    }

    const { loginWithCredentials } = await import("@/app/lib/auth");
    const user = await loginWithCredentials({
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
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "حدث خطأ أثناء محاولة تسجيل الدخول";
    console.error("[POST /api/auth/login]", error);
    const isClientError = message.includes("بيانات الدخول");
    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 },
    );
  }
}

