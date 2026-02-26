"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClientForm() {
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
    const platformName = formData.get("platformName")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const platformUrl = formData.get("platformUrl")?.toString().trim();
    const pricePaid = formData.get("pricePaid")?.toString();
    const featuresModificationsPrice = formData.get("featuresModificationsPrice")?.toString();

    if (!name || !platformName || !phone || !platformUrl) {
      setError("الاسم، اسم المنصة، الهاتف، ورابط الموقع مطلوبة.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          platformName,
          phone,
          platformUrl,
          pricePaid: Math.max(0, parseInt(String(pricePaid), 10) || 0),
          featuresModificationsPrice: Math.max(0, parseInt(String(featuresModificationsPrice), 10) || 0),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error || "فشل إضافة العميل";
        const detail = data.detail ? `\n${data.detail}` : "";
        throw new Error(msg + detail);
      }
      setSuccess(true);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إضافة العميل");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            اسم العميل
          </label>
          <input
            type="text"
            name="name"
            required
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="اسم العميل"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            اسم منصة العميل
          </label>
          <input
            type="text"
            name="platformName"
            required
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="اسم المنصة"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            رقم هاتف العميل
          </label>
          <input
            type="text"
            name="phone"
            required
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="رقم الهاتف"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            رابط الموقع
          </label>
          <input
            type="url"
            name="platformUrl"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="https://..."
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            سعر تكلفة المنصة (المبلغ المدفوع)
          </label>
          <input
            type="number"
            name="pricePaid"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">
            سعر المميزات والتعديلات التي طلبها العميل في منصته
          </label>
          <input
            type="number"
            name="featuresModificationsPrice"
            min={0}
            step={1}
            defaultValue={0}
            dir="rtl"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            placeholder="0"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {success && (
        <p className="text-sm text-emerald-400">تم إضافة العميل بنجاح.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500 disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "إضافة عميل جديد"}
      </button>
    </form>
  );
}
