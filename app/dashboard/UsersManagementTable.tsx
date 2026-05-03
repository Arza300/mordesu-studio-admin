"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Role } from "@prisma/client";
import { Pencil, Trash2, UserCog, UserPlus } from "lucide-react";
import EditUserModal from "./EditUserModal";
import DataTableShell from "./ui/DataTableShell";
import SectionEmptyState from "./ui/SectionEmptyState";
import {
  tableActionGroup,
  tableBody,
  tableBtnCyan,
  tableBtnDelete,
  tableBtnEdit,
  tableHeadRow,
  tableRow,
  tableTd,
  tableTh,
} from "./ui/tableClasses";

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

export default function UsersManagementTable({
  users,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const roleLabel: Record<Role, string> = {
    ADMIN: "أدمن",
    VIEWER: "متفرج",
    USER: "قيد المراجعة",
  };

  async function handleDelete(user: User) {
    if (user.id === currentUserId) {
      alert("لا يمكنك حذف حسابك أنت.");
      return;
    }
    if (!confirm(`هل تريد حذف الحساب "${user.email}"؟ لا يمكن التراجع.`))
      return;
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
      <SectionEmptyState
        icon={UserCog}
        title="لا يوجد مستخدمون"
        description="ستظهر الحسابات هنا عند تسجيل مستخدمين جدد"
      />
    );
  }

  return (
    <>
      <DataTableShell>
        <table className="min-w-full text-start">
          <thead>
            <tr className={tableHeadRow}>
              <th className={tableTh}>البريد</th>
              <th className={tableTh}>الاسم</th>
              <th className={tableTh}>الرتبة</th>
              <th className={tableTh}>تاريخ التسجيل</th>
              <th className={tableTh}>إجراء</th>
            </tr>
          </thead>
          <tbody className={tableBody}>
            {users.map((u) => (
              <tr key={u.id} className={tableRow}>
                <td className={`${tableTd} text-zinc-300`} dir="ltr">
                  {u.email}
                </td>
                <td className={`${tableTd} font-medium text-white`}>
                  {u.name || "—"}
                </td>
                <td className={`${tableTd} text-zinc-400`}>
                  {roleLabel[u.role]}
                </td>
                <td className={`${tableTd} text-zinc-500`}>
                  {formatDate(u.createdAt)}
                </td>
                <td className={tableTd}>
                  <div className={tableActionGroup}>
                    <button
                      type="button"
                      onClick={() => setEditing(u)}
                      className={tableBtnEdit}
                    >
                      <Pencil aria-hidden />
                      تعديل
                    </button>
                    {u.role !== "ADMIN" ? (
                      <button
                        type="button"
                        onClick={() => handlePromote(u.id)}
                        disabled={promotingId === u.id}
                        className={tableBtnCyan}
                      >
                        <UserPlus aria-hidden />
                        {promotingId === u.id ? "جاري..." : "ترقية إلى أدمن"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      disabled={u.id === currentUserId || deletingId === u.id}
                      className={tableBtnDelete}
                      title={
                        u.id === currentUserId
                          ? "لا يمكن حذف حسابك"
                          : undefined
                      }
                    >
                      <Trash2 aria-hidden />
                      {deletingId === u.id ? "جاري الحذف..." : "حذف"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTableShell>
      {editing ? (
        <EditUserModal user={editing} onClose={() => setEditing(null)} />
      ) : null}
    </>
  );
}
