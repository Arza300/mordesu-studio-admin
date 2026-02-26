"use client";

import { useState, useRef, useEffect } from "react";
import EditMyAccountForm from "./EditMyAccountForm";

type Props = {
  user: { id: string; email: string; name: string | null };
};

export default function DashboardHeaderUser({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-right transition hover:border-zinc-600 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-medium text-cyan-400">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </span>
          <span className="max-w-[120px] truncate text-sm text-zinc-300 sm:max-w-[180px]">
            {user.name || user.email}
          </span>
          <span className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
            ▼
          </span>
        </button>
        {open && (
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setModalOpen(true);
              }}
              className="w-full px-4 py-2.5 text-right text-sm text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
            >
              تغيير بيانات الحساب
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-my-account-title"
        >
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 id="edit-my-account-title" className="text-lg font-semibold text-white">
                تعديل بيانات حسابي
              </h2>
              <p className="mt-0.5 text-sm text-zinc-400">
                تغيير الاسم أو البريد أو كلمة المرور
              </p>
            </div>
            <div className="p-6">
              <EditMyAccountForm user={user} onSuccess={() => setModalOpen(false)} />
            </div>
            <div className="border-t border-zinc-800 px-6 py-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
