import { NextResponse } from "next/server";
import { logout } from "@/app/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await logout();
  const url = new URL(request.url);
  const origin = url.origin;
  return NextResponse.redirect(new URL("/", origin));
}
