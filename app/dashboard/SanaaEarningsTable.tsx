"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MonitorPlay, Pencil, Trash2 } from "lucide-react";
import EditSanaaModal from "./EditSanaaModal";
import DataTableShell from "./ui/DataTableShell";
import SectionEmptyState from "./ui/SectionEmptyState";
import {
  tableActionGroup,
  tableBody,
  tableBtnDelete,
  tableBtnEdit,
  tableHeadRow,
  tableRow,
  tableTd,
  tableTdMuted,
  tableTdNums,
  tableTh,
} from "./ui/tableClasses";

type SanaaEntry = {
  id: string;
  viewsAmount: number;
  collaborationsAmount: number;
  createdAt: Date;
};

type Props = { entries: SanaaEntry[]; canEdit?: boolean };

export default function SanaaEarningsTable({ entries, canEdit = true }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<SanaaEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(entry: SanaaEntry) {
    if (!confirm("هل تريد حذف هذا السجل؟ لا يمكن التراجع.")) return;
    setDeletingId(entry.id);
    try {
      const res = await fetch(`/api/admin/sanaa-earnings/${entry.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "فشل حذف السجل");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (entries.length === 0) {
    return (
      <SectionEmptyState
        icon={MonitorPlay}
        title="لا توجد سجلات حتى الآن"
        description="أضف أرباحاً من قسم أرباح منصة صناع أعلاه"
      />
    );
  }

  return (
    <>
      <DataTableShell>
        <table className="min-w-full text-start">
          <thead>
            <tr className={tableHeadRow}>
              <th className={tableTh}>التاريخ</th>
              <th className={tableTh}>أرباح المشاهدات</th>
              <th className={tableTh}>تعاونات</th>
              <th className={tableTh}>الإجمالي</th>
              {canEdit ? <th className={tableTh}>إجراء</th> : null}
            </tr>
          </thead>
          <tbody className={tableBody}>
            {entries.map((entry) => {
              const rowTotal = entry.viewsAmount + entry.collaborationsAmount;
              return (
                <tr key={entry.id} className={tableRow}>
                  <td className={tableTdMuted}>{formatDate(entry.createdAt)}</td>
                  <td className={tableTdNums}>
                    {entry.viewsAmount.toLocaleString("ar-EG")}
                  </td>
                  <td className={tableTdNums}>
                    {entry.collaborationsAmount.toLocaleString("ar-EG")}
                  </td>
                  <td
                    className={`${tableTd} font-medium tabular-nums text-white`}
                  >
                    {rowTotal.toLocaleString("ar-EG")}
                  </td>
                  {canEdit ? (
                    <td className={tableTd}>
                      <div className={tableActionGroup}>
                        <button
                          type="button"
                          onClick={() => setEditing(entry)}
                          className={tableBtnEdit}
                        >
                          <Pencil aria-hidden />
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry)}
                          disabled={deletingId === entry.id}
                          className={tableBtnDelete}
                        >
                          <Trash2 aria-hidden />
                          {deletingId === entry.id ? "جاري الحذف..." : "حذف"}
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataTableShell>
      {editing ? (
        <EditSanaaModal entry={editing} onClose={() => setEditing(null)} />
      ) : null}
    </>
  );
}
