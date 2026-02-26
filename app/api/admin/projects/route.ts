import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { ProjectType } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  try {
    const projects = await prisma.gameProject.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[GET /api/admin/projects]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المشاريع" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, profits, projectType, projectLink } = body as {
      name?: string;
      profits?: number;
      projectType?: string;
      projectLink?: string;
    };

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "اسم اللعبة مطلوب" },
        { status: 400 },
      );
    }

    const profitsNum = typeof profits === "number" ? profits : Number(profits);
    if (Number.isNaN(profitsNum) || profitsNum < 0) {
      return NextResponse.json(
        { error: "أرباح اللعبة يجب أن تكون رقماً غير سالب" },
        { status: 400 },
      );
    }

    const type =
      projectType === "INVESTOR" ? ProjectType.INVESTOR : ProjectType.PRIVATE;

    const project = await prisma.gameProject.create({
      data: {
        name: name.trim(),
        profits: Math.round(profitsNum),
        projectType: type,
        projectLink: projectLink?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/projects]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة المشروع" },
      { status: 500 },
    );
  }
}
