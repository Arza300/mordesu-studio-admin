"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditCollaborationModal from "./EditCollaborationModal";

type CollaborationEntry = {
  id: string;
  description: string;
  monetaryBenefit: number;
  createdAt: Date;
};

type Props = { entries: CollaborationEntry[]; canEdit?: boolean };

export default function CollaborationsTable({ entries, canEdit = true }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<CollaborationEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(entry: CollaborationEntry) {
    if (!confirm(`هل تريد حذف تعاون "${entry.description.slice(0, 50)}..."؟ لا يمكن التراجع.`)) return;
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/20 py-12 text-center">
        <span className="mb-2 text-3xl opacity-60">🤝</span>
        <p className="text-sm font-medium text-zinc-400">لا توجد تعاونات حتى الآن</p>
        <p className="mt-1 text-xs text-zinc-500">أضف تعاوناً من قسم تعاونات الاستوديو أعلاه</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-800/80">
        <table className="min-w-full text-right">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                التاريخ
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                وصف التعاون
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                الربح العائد
              </th>
              {canEdit && (
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  إجراء
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {entries.map((entry) => (
              <tr key={entry.id} className="transition hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-sm text-zinc-400">{formatDate(entry.createdAt)}</td>
                <td className="max-w-[280px] px-4 py-3 text-sm font-medium text-white">
                  <span className="line-clamp-2">{entry.description}</span>
                </td>
                <td className="px-4 py-3 text-sm tabular-nums text-zinc-300">
                  {entry.monetaryBenefit.toLocaleString("ar-EG")}
                </td>
                {canEdit && (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(entry)}
                        className="rounded-xl bg-amber-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500/90"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry)}
                        disabled={deletingId === entry.id}
                        className="rounded-xl bg-red-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500/90 disabled:opacity-50"
                      >
                        {deletingId === entry.id ? "جاري الحذف..." : "حذف"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <EditCollaborationModal
          entry={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
