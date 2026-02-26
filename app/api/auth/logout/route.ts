import { NextResponse } from "next/server";
import { logout } from "@/app/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await logout();
  const url = new URL(request.url);
  const origin = url.origin;
  const accept = request.headers.get("accept") ?? "";
  // لو الطلب من fetch (يطلب JSON) نرجع JSON ونتجنب 406؛ وإلا نرجع redirect للفورم
  if (accept.includes("application/json")) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  return NextResponse.redirect(new URL("/", origin), 303);
}
