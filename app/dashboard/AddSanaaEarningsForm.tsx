"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSanaaEarningsForm() {
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
    const viewsAmount = formData.get("viewsAmount")?.toString();
    const collaborationsAmount = formData.get("collaborationsAmount")?.toString();

    const views = Math.max(0, parseInt(String(viewsAmount), 10) || 0);
    const collab = Math.max(0, parseInt(String(collaborationsAmount), 10) || 0);

    if (views === 0 && collab === 0) {
      setError("أدخل مبلغاً في أحد الحقلين على الأقل.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/sanaa-earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewsAmount: views, collaborationsAmount: collab }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "فشل إضافة الأرباح");
      }
      setSuccess(true);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إضافة الأرباح");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            إضافة أرباح من المشاهدات
          </label>
          <input
            type="number"
            name="viewsAmount"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            تعاونات
          </label>
          <input
            type="number"
            name="collaborationsAmount"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
            placeholder="0"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-400">تم إضافة الأرباح بنجاح وتُحسب ضمن الإجمالي.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-500 disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "إضافة أرباح"}
      </button>
    </form>
  );
}
