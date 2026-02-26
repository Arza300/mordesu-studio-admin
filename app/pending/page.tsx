import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import LogoutButton from "@/app/dashboard/LogoutButton";

export const runtime = "nodejs";

export default async function PendingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  if (user.role === "ADMIN" || user.role === "VIEWER") {
    redirect("/dashboard");
  }
  if (user.role !== "USER") {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-xl">
        <div className="mb-6 text-6xl">⏳</div>
        <h1 className="text-2xl font-semibold text-white">
          حسابك قيد المراجعة
        </h1>
        <p className="mt-3 text-zinc-400">
          تم استلام طلبك. حسابك في انتظار قبول أحد الأدمن المسؤولين عن النظام.
          سيتم إبلاغك عند الموافقة على تفعيل صلاحية لوحة التحكم.
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          البريد المسجّل: <span className="text-zinc-300">{user.email}</span>
        </p>
        <div className="mt-8">
          <LogoutButton
            label="تسجيل الخروج"
            loadingLabel="جاري الخروج..."
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:opacity-60"
          />
        </div>
      </div>
    </main>
  );
}
