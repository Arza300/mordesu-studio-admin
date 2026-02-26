"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Role } from "@prisma/client";
import EditUserModal from "./EditUserModal";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
};

type Props = {
  users: User[];
  currentUserId: string;
};

export default function UsersManagementTable({ users, currentUserId }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const roleLabel: Record<Role, string> = {
    ADMIN: "أدمن",
    VIEWER: "متفرج",
    USER: "مستخدم",
  };

  async function handleDelete(user: User) {
    if (user.id === currentUserId) {
      alert("لا يمكنك حذف حسابك أنت.");
      return;
    }
    if (!confirm(`هل تريد حذف الحساب "${user.email}"؟ لا يمكن التراجع.`)) return;
    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "فشل حذف المستخدم");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  async function handlePromote(userId: string) {
    setPromotingId(userId);
    try {
      const formData = new FormData();
      formData.set("userId", userId);
      const res = await fetch("/api/admin/users/promote", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok || res.status === 302) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "فشل الترقية");
      }
    } finally {
      setPromotingId(null);
    }
  }

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/20 py-12 text-center">
        <p className="text-sm font-medium text-zinc-400">لا يوجد مستخدمون</p>
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
                البريد
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                الاسم
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                الرتبة
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                تاريخ التسجيل
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                إجراء
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {users.map((u) => (
              <tr key={u.id} className="transition hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-sm text-zinc-300" dir="ltr">
                  {u.email}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-white">
                  {u.name || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {roleLabel[u.role]}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500">
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(u)}
                      className="rounded-xl bg-amber-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500/90"
                    >
                      تعديل
                    </button>
                    {u.role !== "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => handlePromote(u.id)}
                        disabled={promotingId === u.id}
                        className="rounded-xl bg-cyan-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500/90 disabled:opacity-50"
                      >
                        {promotingId === u.id ? "جاري..." : "ترقية إلى أدمن"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      disabled={u.id === currentUserId || deletingId === u.id}
                      className="rounded-xl bg-red-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={u.id === currentUserId ? "لا يمكن حذف حسابك" : undefined}
                    >
                      {deletingId === u.id ? "جاري الحذف..." : "حذف"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <EditUserModal
          user={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
