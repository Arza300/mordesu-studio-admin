"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  user: { id: string; email: string; name: string | null };
  onSuccess?: () => void;
};

export default function EditMyAccountForm({ user, onSuccess }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const newPassword = formData.get("newPassword")?.toString();

    if (!email) {
      setError("البريد الإلكتروني مطلوب.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email,
          newPassword: newPassword && newPassword.length > 0 ? newPassword : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "فشل تحديث البيانات");
      }
      setSuccess(true);
      router.refresh();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">الاسم</label>
          <input
            type="text"
            name="name"
            dir="rtl"
            defaultValue={user.name ?? ""}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="الاسم"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            required
            dir="ltr"
            defaultValue={user.email}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="email@example.com"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">
          كلمة المرور الجديدة <span className="text-zinc-500">(اختياري — اتركها فارغة إن لم تُرد التغيير)</span>
        </label>
        <input
          type="password"
          name="newPassword"
          minLength={6}
          dir="ltr"
          autoComplete="new-password"
          className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-emerald-400">تم تحديث بياناتك بنجاح.</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500 disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
      </button>
    </form>
  );
}
