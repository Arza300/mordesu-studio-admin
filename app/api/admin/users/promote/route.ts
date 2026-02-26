import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const formData = await request.formData().catch(() => new FormData());
  const userId = formData.get("userId")?.toString();
  if (!userId) {
    return NextResponse.json(
      { error: "معرّف المستخدم مطلوب" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }
  if (user.role === "ADMIN") {
    const url = new URL(request.url);
    return NextResponse.redirect(new URL("/dashboard", url.origin));
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });

  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/dashboard", url.origin));
}
