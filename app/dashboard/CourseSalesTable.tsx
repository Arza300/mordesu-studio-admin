"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import EditCourseSalesModal from "./EditCourseSalesModal";
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

type CourseSalesEntry = {
  id: string;
  platformName: string;
  profits: number;
  createdAt: Date;
};

type Props = { entries: CourseSalesEntry[]; canEdit?: boolean };

export default function CourseSalesTable({ entries, canEdit = true }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<CourseSalesEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(entry: CourseSalesEntry) {
    if (
      !confirm(
        `هل تريد حذف سجل "${entry.platformName}"؟ لا يمكن التراجع.`,
      )
    )
      return;
    setDeletingId(entry.id);
    try {
      const res = await fetch(`/api/admin/course-sales/${entry.id}`, {
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
        icon={BookOpen}
        title="لا توجد سجلات حتى الآن"
        description="أضف أرباحاً من قسم أرباح بيع الكورسات أعلاه"
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
              <th className={tableTh}>اسم المنصة</th>
              <th className={tableTh}>الأرباح</th>
              {canEdit ? <th className={tableTh}>إجراء</th> : null}
            </tr>
          </thead>
          <tbody className={tableBody}>
            {entries.map((entry) => (
              <tr key={entry.id} className={tableRow}>
                <td className={tableTdMuted}>{formatDate(entry.createdAt)}</td>
                <td className={tableTdStrong}>{entry.platformName}</td>
                <td className={tableTdNums}>
                  {entry.profits.toLocaleString("ar-EG")}
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
        <EditCourseSalesModal
          entry={editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </>
  );
}
