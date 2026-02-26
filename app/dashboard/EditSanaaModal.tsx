"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type SanaaEntry = {
  id: string;
  viewsAmount: number;
  collaborationsAmount: number;
  createdAt: Date;
};

export default function EditSanaaModal({
  entry,
  onClose,
}: {
  entry: SanaaEntry;
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
    const viewsAmount = Math.max(0, parseInt(String(formData.get("viewsAmount")), 10) || 0);
    const collaborationsAmount = Math.max(0, parseInt(String(formData.get("collaborationsAmount")), 10) || 0);

    try {
      const res = await fetch(`/api/admin/sanaa-earnings/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewsAmount, collaborationsAmount }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "فشل تحديث السجل");
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث السجل");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-sanaa-title"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 id="edit-sanaa-title" className="text-lg font-semibold text-white">
            تعديل سجل أرباح منصة صناع
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">أرباح المشاهدات</label>
              <input
                type="number"
                name="viewsAmount"
                min={0}
                step={1}
                defaultValue={entry.viewsAmount}
                dir="rtl"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">تعاونات</label>
              <input
                type="number"
                name="collaborationsAmount"
                min={0}
                step={1}
                defaultValue={entry.collaborationsAmount}
                dir="rtl"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
              />
            </div>
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
              className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
            >
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
