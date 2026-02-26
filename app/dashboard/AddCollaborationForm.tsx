"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCollaborationForm() {
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
    const description = formData.get("description")?.toString().trim();
    const monetaryBenefit = formData.get("monetaryBenefit")?.toString();

    if (!description) {
      setError("وصف التعاون مطلوب.");
      setLoading(false);
      return;
    }

    const benefitNum = Math.max(0, parseInt(String(monetaryBenefit), 10) || 0);

    try {
      const res = await fetch("/api/admin/collaborations", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, monetaryBenefit: benefitNum }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "فشل إضافة التعاون");
      }
      setSuccess(true);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إضافة التعاون");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">
            وصف التعاون
          </label>
          <input
            type="text"
            name="description"
            required
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-teal-500/60 focus:outline-none focus:ring-1 focus:ring-teal-500/40"
            placeholder="وصف التعاون"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            الربح العائد من هذا التعاون
          </label>
          <input
            type="number"
            name="monetaryBenefit"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-teal-500/60 focus:outline-none focus:ring-1 focus:ring-teal-500/40"
            placeholder="0"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-400">تم إضافة التعاون بنجاح ويُحسب ضمن إجمالي الأرباح.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-500 disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "إضافة تعاون"}
      </button>
    </form>
  );
}
