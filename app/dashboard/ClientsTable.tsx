"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditClientModal from "./EditClientModal";

type Client = {
  id: string;
  name: string;
  platformName: string;
  phone: string;
  platformUrl: string;
  pricePaid: number;
  featuresModificationsPrice?: number | null;
};

type Props = {
  clients: Client[];
  canEdit?: boolean;
  hidePhone?: boolean;
};

export default function ClientsTable({ clients, canEdit = true, hidePhone = false }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const searchTrim = search.trim();
  const filteredClients = searchTrim
    ? clients.filter(
        (c) => {
          const q = searchTrim.replace(/\s/g, "");
          const match = (s: string) =>
            s.includes(searchTrim) || s.replace(/\s/g, "").includes(q);
          const byPhone = hidePhone ? false : match(c.phone);
          return match(c.name) || match(c.platformName) || byPhone;
        },
      )
    : clients;

  async function handleDelete(client: Client) {
    if (!confirm(`هل تريد حذف العميل "${client.name}" (${client.platformName})؟ لا يمكن التراجع.`)) return;
    setDeletingId(client.id);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "فشل حذف العميل");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="mb-4">
        <label htmlFor="client-search" className="sr-only">
          {hidePhone ? "بحث بالاسم أو اسم المنصة" : "بحث بالاسم أو اسم المنصة أو رقم الهاتف"}
        </label>
        <input
          id="client-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hidePhone ? "بحث بالاسم أو اسم المنصة..." : "بحث بالاسم أو اسم المنصة أو رقم الهاتف..."}
          dir="rtl"
          className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
        />
        {searchTrim && (
          <p className="mt-1.5 text-xs text-zinc-400">
            {filteredClients.length === 0
              ? "لا توجد نتائج مطابقة"
              : `عرض ${filteredClients.length} من ${clients.length}`}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/80">
        <table className="min-w-full text-right">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                العميل
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                المنصة
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                الهاتف
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                رابط الموقع
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                تكلفة المنصة
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                المميزات والتعديلات
              </th>
              {canEdit && (
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  إجراء
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 7 : 6} className="px-4 py-12 text-center text-sm text-zinc-500">
                  {searchTrim ? "لا توجد نتائج مطابقة للبحث." : "لا يوجد عملاء."}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
              <tr key={client.id} className="transition hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-sm font-medium text-white">{client.name}</td>
                <td className="px-4 py-3 text-sm text-zinc-300">{client.platformName}</td>
                <td className="px-4 py-3 text-sm text-zinc-400" dir="ltr">
                  {hidePhone ? "—" : client.phone}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={client.platformUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    رابط الموقع
                    <span className="text-cyan-500/70">↗</span>
                  </a>
                </td>
                <td className="px-4 py-3 text-sm tabular-nums text-zinc-300">
                  {client.pricePaid.toLocaleString("ar-EG")}
                </td>
                <td className="px-4 py-3 text-sm tabular-nums text-zinc-300">
                  {(client.featuresModificationsPrice ?? 0).toLocaleString("ar-EG")}
                </td>
                {canEdit && (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingClient(client)}
                        className="rounded-xl bg-amber-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500/90"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(client)}
                        disabled={deletingId === client.id}
                        className="rounded-xl bg-red-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500/90 disabled:opacity-50"
                      >
                        {deletingId === client.id ? "جاري الحذف..." : "حذف"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
        />
      )}
    </>
  );
}
