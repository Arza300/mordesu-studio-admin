"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Handshake, Pencil, Trash2 } from "lucide-react";
import EditCollaborationModal from "./EditCollaborationModal";
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

type CollaborationEntry = {
  id: string;
  description: string;
  monetaryBenefit: number;
  createdAt: Date;
};

type Props = { entries: CollaborationEntry[]; canEdit?: boolean };

export default function CollaborationsTable({
  entries,
  canEdit = true,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<CollaborationEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(entry: CollaborationEntry) {
    if (
      !confirm(
        `هل تريد حذف تعاون "${entry.description.slice(0, 50)}..."؟ لا يمكن التراجع.`,
      )
    )
      return;
    setDeletingId(entry.id);
    try {
      const res = await fetch(`/api/admin/collaborations/${entry.id}`, {
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
        icon={Handshake}
        title="لا توجد تعاونات حتى الآن"
        description="أضف تعاوناً من قسم تعاونات الاستوديو أعلاه"
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
              <th className={tableTh}>وصف التعاون</th>
              <th className={tableTh}>الربح العائد</th>
              {canEdit ? <th className={tableTh}>إجراء</th> : null}
            </tr>
          </thead>
          <tbody className={tableBody}>
            {entries.map((entry) => (
              <tr key={entry.id} className={tableRow}>
                <td className={tableTdMuted}>{formatDate(entry.createdAt)}</td>
                <td className={`max-w-[280px] ${tableTdStrong}`}>
                  <span className="line-clamp-2">{entry.description}</span>
                </td>
                <td className={tableTdNums}>
                  {entry.monetaryBenefit.toLocaleString("ar-EG")}
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
        <EditCollaborationModal
          entry={editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </>
  );
}
