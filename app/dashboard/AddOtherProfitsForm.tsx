"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddOtherProfitsForm() {
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
    const reason = formData.get("reason")?.toString().trim();
    const profit = formData.get("profit")?.toString();

    if (!reason) {
      setError("سبب الربح مطلوب.");
      setLoading(false);
      return;
    }

    const profitNum = Math.max(0, parseInt(String(profit), 10) || 0);

    try {
      const res = await fetch("/api/admin/other-profits", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, profit: profitNum }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "فشل إضافة الربح");
      }
      setSuccess(true);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إضافة الربح");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            سبب الربح
          </label>
          <input
            type="text"
            name="reason"
            required
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-rose-500/60 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
            placeholder="سبب الربح"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            الربح
          </label>
          <input
            type="number"
            name="profit"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-rose-500/60 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
            placeholder="0"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-400">تم إضافة الربح بنجاح وتُحسب ضمن إجمالي الأرباح.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-500 disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "إضافة ربح"}
      </button>
    </form>
  );
}
