"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddGameProjectForm() {
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
    const profits = formData.get("profits")?.toString();
    const projectType = formData.get("projectType")?.toString() || "PRIVATE";
    const projectLink = formData.get("projectLink")?.toString().trim() || undefined;

    if (!name) {
      setError("اسم اللعبة مطلوب.");
      setLoading(false);
      return;
    }

    const profitsNum = Math.max(0, parseInt(String(profits), 10) || 0);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profits: profitsNum,
          projectType: projectType === "INVESTOR" ? "INVESTOR" : "PRIVATE",
          projectLink: projectLink || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "فشل إضافة المشروع");
      }
      setSuccess(true);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إضافة المشروع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            اسم اللعبة
          </label>
          <input
            type="text"
            name="name"
            required
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="اسم اللعبة"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            أرباح اللعبة
          </label>
          <input
            type="number"
            name="profits"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">
          رابط المشروع
        </label>
        <input
          type="url"
          name="projectLink"
          dir="ltr"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-zinc-300">
          نوع المشروع
        </span>
        <div className="flex flex-wrap gap-6" dir="rtl">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="projectType"
              value="PRIVATE"
              defaultChecked
              className="h-4 w-4 border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/50"
            />
            <span className="text-sm text-zinc-300">مشروع خاص</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="projectType"
              value="INVESTOR"
              className="h-4 w-4 border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/50"
            />
            <span className="text-sm text-zinc-300">تابع لمستثمر</span>
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-400">تم إضافة المشروع بنجاح.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500 disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "إضافة مشروع"}
      </button>
    </form>
  );
}
