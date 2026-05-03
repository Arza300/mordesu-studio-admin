"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import ClientDetailsModal from "./ClientDetailsModal";
import EditClientModal from "./EditClientModal";
import DataTableShell from "./ui/DataTableShell";
import {
  tableActionGroup,
  tableBody,
  tableBtnDelete,
  tableBtnDetails,
  tableBtnEdit,
  tableHeadRow,
  tableRow,
  tableTd,
  tableTdNums,
  tableTdStrong,
  tableTh,
} from "./ui/tableClasses";

type Client = {
  id: string;
  name: string;
  platformName: string;
  phone: string;
  platformUrl: string;
  pricePaid: number;
  featuresModificationsPrice?: number | null;
  projectAccounts?: Prisma.JsonValue | null;
  subscriptions?: Prisma.JsonValue | null;
};

type Props = {
  clients: Client[];
  canEdit?: boolean;
  hidePhone?: boolean;
};

export default function ClientsTable({
  clients,
  canEdit = true,
  hidePhone = false,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailsClient, setDetailsClient] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const searchTrim = search.trim();
  const filteredClients = searchTrim
    ? clients.filter((c) => {
        const q = searchTrim.replace(/\s/g, "");
        const match = (s: string) =>
          s.includes(searchTrim) || s.replace(/\s/g, "").includes(q);
        const byPhone = hidePhone ? false : match(c.phone);
        return match(c.name) || match(c.platformName) || byPhone;
      })
    : clients;

  async function handleDelete(client: Client) {
    if (
      !confirm(
        `هل تريد حذف العميل "${client.name}" (${client.platformName})؟ لا يمكن التراجع.`,
      )
    )
      return;
    setDeletingId(client.id);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "DELETE",
      });
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
          {hidePhone
            ? "بحث بالاسم أو اسم المنصة"
            : "بحث بالاسم أو اسم المنصة أو رقم الهاتف"}
        </label>
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            id="client-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              hidePhone
                ? "بحث بالاسم أو اسم المنصة..."
                : "بحث بالاسم أو اسم المنصة أو رقم الهاتف..."
            }
            dir="rtl"
            className="w-full rounded-xl border border-zinc-700/90 bg-zinc-900/80 py-2.5 pe-4 ps-10 text-sm text-white shadow-inner ring-1 ring-white/5 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>
        {searchTrim ? (
          <p className="mt-2 text-xs text-zinc-500">
            {filteredClients.length === 0
              ? "لا توجد نتائج مطابقة"
              : `عرض ${filteredClients.length} من ${clients.length}`}
          </p>
        ) : null}
      </div>

      <DataTableShell>
        <table className="min-w-full text-start">
          <thead>
            <tr className={tableHeadRow}>
              <th className={tableTh}>العميل</th>
              <th className={tableTh}>المنصة</th>
              <th className={tableTh}>الهاتف</th>
              <th className={tableTh}>رابط الموقع</th>
              <th className={tableTh}>تكلفة المنصة</th>
              <th className={tableTh}>المميزات والتعديلات</th>
              <th className={tableTh}>إجراءات</th>
            </tr>
          </thead>
          <tbody className={tableBody}>
            {filteredClients.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-zinc-500"
                >
                  {searchTrim
                    ? "لا توجد نتائج مطابقة للبحث."
                    : "لا يوجد عملاء."}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className={tableRow}>
                  <td className={tableTdStrong}>{client.name}</td>
                  <td className={`${tableTd} text-zinc-300`}>
                    {client.platformName}
                  </td>
                  <td className={`${tableTd} text-zinc-400`} dir="ltr">
                    {hidePhone ? "—" : client.phone}
                  </td>
                  <td className={tableTd}>
                    <a
                      href={client.platformUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 underline-offset-2 hover:text-cyan-300 hover:underline"
                    >
                      رابط الموقع
                      <span className="text-cyan-500/80" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </td>
                  <td className={tableTdNums}>
                    {client.pricePaid.toLocaleString("ar-EG")}
                  </td>
                  <td className={tableTdNums}>
                    {(client.featuresModificationsPrice ?? 0).toLocaleString(
                      "ar-EG",
                    )}
                  </td>
                  <td className={tableTd}>
                    <div className={tableActionGroup}>
                      <button
                        type="button"
                        onClick={() => setDetailsClient(client)}
                        className={tableBtnDetails}
                      >
                        <Eye aria-hidden />
                        تفاصيل
                      </button>
                      {canEdit ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingClient(client)}
                            className={tableBtnEdit}
                          >
                            <Pencil aria-hidden />
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(client)}
                            disabled={deletingId === client.id}
                            className={tableBtnDelete}
                          >
                            <Trash2 aria-hidden />
                            {deletingId === client.id
                              ? "جاري الحذف..."
                              : "حذف"}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataTableShell>

      {detailsClient ? (
        <ClientDetailsModal
          client={detailsClient}
          onClose={() => setDetailsClient(null)}
          hidePhone={hidePhone}
        />
      ) : null}

      {editingClient ? (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
        />
      ) : null}
    </>
  );
}
