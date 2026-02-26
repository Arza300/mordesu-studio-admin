"use client";

import LoadingOverlay from "@/app/components/LoadingOverlay";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

export default function Home() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-zinc-100">
      {loading && (
        <LoadingOverlay
          message={authMode === "login" ? "جاري تسجيل الدخول..." : "جاري إنشاء الحساب..."}
        />
      )}
      {/* خلفية ثابتة */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_#22d3ee33,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -inset-40 bg-[conic-gradient(from_210deg_at_50%_50%,#22d3ee22,#a855f722,#22d3ee22)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#18181b55_1px,transparent_1px),linear-gradient(to_bottom,#18181b55_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />

      {/* Card */}
      <section className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 px-4 py-10 sm:px-8 md:flex-row" dir="rtl">
        <div className="flex flex-1 flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-4 flex-row-reverse">
            <Image
              src="/mordesu-logo.png"
              alt="Mordesu Studio logo"
              width={120}
              height={120}
              className="logo-glow-pulse"
            />
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                Mordesu Studio
              </p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                نظام كامل لحفظ بيانات العملاء
              </h1>
            </div>
          </div>
          <p className="max-w-md text-base text-zinc-300 sm:text-lg">
            نظام مركزي لحفظ وإدارة بيانات عملاء{" "}
            <span className="font-semibold text-cyan-300">Mordesu Studio</span>،
            تتبّع العملاء والمنصات والأرباح في مكان واحد.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-zinc-400">
            <span className="rounded-full border border-cyan-700/40 bg-cyan-500/10 px-3 py-1.5">
              Client Database
            </span>
            <span className="rounded-full border border-purple-700/40 bg-purple-500/10 px-3 py-1.5">
              Data Management
            </span>
            <span className="rounded-full border border-emerald-700/40 bg-emerald-500/10 px-3 py-1.5">
              Secure Storage
            </span>
          </div>
        </div>

        {/* Auth panel */}
        <div className="relative mt-6 w-full max-w-md rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-6 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/80 to-cyan-400/0" />
          <div className="mb-6 flex rounded-full border border-zinc-800 bg-zinc-900/70 p-1.5 text-sm">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                authMode === "login"
                  ? "bg-cyan-500 text-black"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                authMode === "register"
                  ? "bg-cyan-500 text-black"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          <form
            className="space-y-4 text-base"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setLoading(true);

              const formData = new FormData(event.currentTarget);
              const name = formData.get("name")?.toString().trim();
              const email = formData.get("email")?.toString().trim() || "";
              const password =
                formData.get("password")?.toString().trim() || "";

              const endpoint =
                authMode === "register" ? "/api/auth/register" : "/api/auth/login";

              try {
                const res = await fetch(endpoint, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, password }),
                });

                const contentType = res.headers.get("content-type") || "";
                let data: { error?: string; user?: { role?: string } } = {};
                if (contentType.includes("application/json")) {
                  data = await res.json();
                } else {
                  await res.text();
                  throw new Error("حدث خطأ في الخادم، جرّب لاحقًا.");
                }
                if (!res.ok) {
                  throw new Error(data.error || "حدث خطأ غير متوقع");
                }

                const nextPath =
                  data.user?.role === "ADMIN" ? "/dashboard" : "/pending";
                router.push(nextPath);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "تعذر تنفيذ العملية، حاول مرة أخرى.",
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            {authMode === "register" && (
<div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">
                اسم المستخدم
              </label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-left text-base text-zinc-100 outline-none ring-0 transition focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/30"
                  placeholder="Username"
                  dir="ltr"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">
                البريد الإلكتروني (حساب الأدمن)
              </label>
              <input
                type="email"
                name="email"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-left text-base text-zinc-100 outline-none ring-0 transition focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/30"
                placeholder="example@gmail.com"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-left text-base text-zinc-100 outline-none ring-0 transition focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/30"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            {authMode === "login" && (
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>تسجيل الدخول كأدمن لإدارة العملاء.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-base font-semibold text-black shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "جارٍ المعالجة..."
                : authMode === "login"
                  ? "تسجيل الدخول"
                  : "إنشاء حساب جديد"}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-center text-sm text-red-400">{error}</p>
          )}

          <p className="mt-4 text-center text-sm text-zinc-500">
            يجب عليك تسجيل الدخول حتى تتمكن من رؤية لوحة التحكم.
          </p>
        </div>
      </section>
    </main>
  );
}
