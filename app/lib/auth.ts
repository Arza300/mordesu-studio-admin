import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "mordesu_session";

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function registerAdmin(params: {
  name?: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: params.email.toLowerCase() },
  });

  if (existing) {
    throw new Error("هذا البريد مستخدم بالفعل");
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  // كل الحسابات الجديدة تكون برتبة متفرج (قيد المراجعة) — ترقية الأدمن من لوحة التحكم
  const user = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email.toLowerCase(),
      passwordHash,
      role: "VIEWER",
    },
  });

  await createSession(user.id, user.role);

  return user;
}

export async function loginWithCredentials(params: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email: params.email.toLowerCase() },
  });

  if (!user) {
    throw new Error("بيانات الدخول غير صحيحة");
  }

  const valid = await bcrypt.compare(params.password, user.passwordHash);
  if (!valid) {
    throw new Error("بيانات الدخول غير صحيحة");
  }

  await createSession(user.id, user.role);

  return user;
}

async function createSession(userId: string, role: "ADMIN" | "VIEWER" | "USER") {
  const secret = getJwtSecret();
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

/** مستخدم متفرج أو قيد المراجعة (لا يرى لوحة التحكم) */
export function isPendingViewer(
  user: { role: string } | null,
): user is { role: "VIEWER" | "USER" } {
  return user?.role === "VIEWER" || user?.role === "USER";
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

