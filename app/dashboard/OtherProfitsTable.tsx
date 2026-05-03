"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Pencil, Trash2 } from "lucide-react";
import EditOtherProfitsModal from "./EditOtherProfitsModal";
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
  tableTdStrong,
  tableTh,
} from "./ui/tableClasses";

type OtherProfitsEntry = {
  id: string;
  reason: string;
  profit: number;
  createdAt: Date;
};

type Props = { entries: OtherProfitsEntry[]; canEdit?: boolean };

export default function OtherProfitsTable({ entries, canEdit = true }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<OtherProfitsEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(entry: OtherProfitsEntry) {
    if (!confirm(`هل تريد حذف سجل "${entry.reason}"؟ لا يمكن التراجع.`))
      return;
    setDeletingId(entry.id);
    try {
      const res = await fetch(`/api/admin/other-profits/${entry.id}`, {
        method: "DELETE",
        credentials: "include",
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
        icon={Coins}
        title="لا توجد سجلات حتى الآن"
        description="أضف أرباحاً من قسم أرباح أخرى أعلاه"
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
              <th className={tableTh}>سبب الربح</th>
              <th className={tableTh}>الربح</th>
              {canEdit ? <th className={tableTh}>إجراء</th> : null}
            </tr>
          </thead>
          <tbody className={tableBody}>
            {entries.map((entry) => (
              <tr key={entry.id} className={tableRow}>
                <td className={tableTdMuted}>{formatDate(entry.createdAt)}</td>
                <td className={tableTdStrong}>{entry.reason}</td>
                <td className={tableTdNums}>
                  {entry.profit.toLocaleString("ar-EG")}
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
            ))}
          </tbody>
        </table>
      </DataTableShell>
      {editing ? (
        <EditOtherProfitsModal
          entry={editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </>
  );
}
