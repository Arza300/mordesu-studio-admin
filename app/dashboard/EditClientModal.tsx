"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
  platformName: string;
  phone: string;
  platformUrl: string;
  pricePaid: number;
  featuresModificationsPrice?: number | null;
};

export default function EditClientModal({
  client,
  onClose,
}: {
  client: Client;
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
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          platformName,
          phone,
          platformUrl,
          pricePaid: pricePaid ? parseInt(pricePaid, 10) || 0 : 0,
          featuresModificationsPrice: featuresModificationsPrice ? parseInt(featuresModificationsPrice, 10) || 0 : 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error || "فشل تحديث العميل";
        const detail = data.detail ? `\n${data.detail}` : "";
        throw new Error(msg + detail);
      }
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث العميل");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-client-title"
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 id="edit-client-title" className="text-lg font-semibold text-white">
            تعديل بيانات العميل
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            {client.name} — {client.platformName}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">اسم العميل</label>
              <input
                type="text"
                name="name"
                required
                dir="rtl"
                defaultValue={client.name}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">اسم المنصة</label>
              <input
                type="text"
                name="platformName"
                required
                dir="rtl"
                defaultValue={client.platformName}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">رقم الهاتف</label>
              <input
                type="text"
                name="phone"
                required
                dir="rtl"
                defaultValue={client.phone}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">رابط الموقع</label>
              <input
                type="url"
                name="platformUrl"
                required
                dir="ltr"
                defaultValue={client.platformUrl}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
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
                defaultValue={client.pricePaid}
                dir="rtl"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">
                سعر المميزات والتعديلات
              </label>
              <input
                type="number"
                name="featuresModificationsPrice"
                min={0}
                step={1}
                defaultValue={client.featuresModificationsPrice ?? 0}
                dir="rtl"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
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
              className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500 disabled:opacity-60"
            >
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
