"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCourseSalesForm() {
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
    const platformName = formData.get("platformName")?.toString().trim();
    const profits = formData.get("profits")?.toString();

    if (!platformName) {
      setError("اسم المنصة مطلوب.");
      setLoading(false);
      return;
    }

    const profitsNum = Math.max(0, parseInt(String(profits), 10) || 0);

    try {
      const res = await fetch("/api/admin/course-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformName, profits: profitsNum }),
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
            اسم المنصة
          </label>
          <input
            type="text"
            name="platformName"
            required
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
            placeholder="اسم المنصة"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            الأرباح من المنصة
          </label>
          <input
            type="number"
            name="profits"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
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
        className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-500 disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "إضافة أرباح"}
      </button>
    </form>
  );
}
