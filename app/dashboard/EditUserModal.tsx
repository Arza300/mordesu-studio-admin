"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Role } from "@prisma/client";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
};

export default function EditUserModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const role = formData.get("role")?.toString();
    const newPassword = formData.get("newPassword")?.toString();

    if (!email) {
      setError("البريد الإلكتروني مطلوب.");
      setLoading(false);
      return;
    }

    const body: { name?: string; email: string; role?: string; newPassword?: string } = {
      name: name || undefined,
      email,
      role: role === "ADMIN" || role === "VIEWER" || role === "USER" ? role : undefined,
    };
    if (newPassword && newPassword.length > 0) body.newPassword = newPassword;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "فشل تحديث المستخدم");
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث المستخدم");
    } finally {
      setLoading(false);
    }
  }

  const roleLabel: Record<Role, string> = {
    ADMIN: "أدمن",
    VIEWER: "متفرج",
    USER: "قيد المراجعة",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 id="edit-user-title" className="text-lg font-semibold text-white">
            تعديل بيانات المستخدم
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400" dir="ltr">
            {user.email}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">الاسم</label>
            <input
              type="text"
              name="name"
              dir="rtl"
              defaultValue={user.name ?? ""}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
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
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">الرتبة</label>
            <select
              name="role"
              defaultValue={user.role}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            >
              <option value="ADMIN">أدمن</option>
              <option value="VIEWER">متفرج</option>
              <option value="USER">قيد المراجعة</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              كلمة مرور جديدة <span className="text-zinc-500">(اختياري)</span>
            </label>
            <input
              type="password"
              name="newPassword"
              minLength={6}
              dir="ltr"
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
            >
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
