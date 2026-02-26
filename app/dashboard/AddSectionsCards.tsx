"use client";

import { useState } from "react";
import AddClientForm from "./AddClientForm";
import AddGameProjectForm from "./AddGameProjectForm";
import AddCourseSalesForm from "./AddCourseSalesForm";
import AddSanaaEarningsForm from "./AddSanaaEarningsForm";

type OpenSection = "client" | "game" | "sanaa" | "courses" | null;

export default function AddSectionsCards() {
  const [openSection, setOpenSection] = useState<OpenSection>(null);

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 shadow-xl">
      <div className="border-b border-zinc-800/80 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          إضافة بيانات
        </h2>
        <p className="mt-0.5 text-sm text-zinc-400">
          اختر إضافة عميل جديد أو مشروع ألعاب ثم أدخل البيانات
        </p>
      </div>
      <div className="p-5">
        {/* أربعة أقسام — حجم متوسط */}
        <div className="grid max-w-[720px] grid-cols-2 gap-4 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "client" ? null : "client"))}
            className="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-zinc-700/80 bg-zinc-800/50 py-3 transition hover:border-cyan-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-cyan-500/60 data-[open=true]:bg-cyan-500/5 data-[open=true]:ring-2 data-[open=true]:ring-cyan-500/30"
            data-open={openSection === "client"}
          >
            <span className="text-2xl opacity-80 transition group-hover:scale-110" aria-hidden>
              👤
            </span>
            <span className="text-center text-sm font-semibold leading-tight text-white">
              إضافة عميل جديد
            </span>
            <span className="text-center text-xs leading-tight text-zinc-400">
              بيانات العميل والمنصة
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "game" ? null : "game"))}
            className="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-zinc-700/80 bg-zinc-800/50 py-3 transition hover:border-emerald-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-emerald-500/60 data-[open=true]:bg-emerald-500/5 data-[open=true]:ring-2 data-[open=true]:ring-emerald-500/30"
            data-open={openSection === "game"}
          >
            <span className="text-2xl opacity-80 transition group-hover:scale-110" aria-hidden>
              🎮
            </span>
            <span className="text-center text-sm font-semibold leading-tight text-white">
              إضافة مشاريع (UE5)
            </span>
            <span className="text-center text-xs leading-tight text-zinc-400">
              مشاريع الألعاب
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "sanaa" ? null : "sanaa"))}
            className="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-zinc-700/80 bg-zinc-800/50 py-3 transition hover:border-amber-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-amber-500/60 data-[open=true]:bg-amber-500/5 data-[open=true]:ring-2 data-[open=true]:ring-amber-500/30"
            data-open={openSection === "sanaa"}
          >
            <span className="text-2xl opacity-80 transition group-hover:scale-110" aria-hidden>
              📺
            </span>
            <span className="text-center text-sm font-semibold leading-tight text-white">
              أرباح منصة صناع
            </span>
            <span className="text-center text-xs leading-tight text-zinc-400">
              مشاهدات وتعاونات
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "courses" ? null : "courses"))}
            className="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-zinc-700/80 bg-zinc-800/50 py-3 transition hover:border-violet-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-violet-500/60 data-[open=true]:bg-violet-500/5 data-[open=true]:ring-2 data-[open=true]:ring-violet-500/30"
            data-open={openSection === "courses"}
          >
            <span className="text-2xl opacity-80 transition group-hover:scale-110" aria-hidden>
              📚
            </span>
            <span className="text-center text-sm font-semibold leading-tight text-white">
              أرباح بيع الكورسات
            </span>
            <span className="text-center text-xs leading-tight text-zinc-400">
              اسم المنصة والأرباح
            </span>
          </button>
        </div>

        {/* المحتوى المفتوح */}
        {openSection === "client" && (
          <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                إضافة عميل جديد
              </h3>
              <button
                type="button"
                onClick={() => setOpenSection(null)}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                إغلاق
              </button>
            </div>
            <AddClientForm />
          </div>
        )}

        {openSection === "game" && (
          <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                إضافة مشاريع (Unreal Engine 5)
              </h3>
              <button
                type="button"
                onClick={() => setOpenSection(null)}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                إغلاق
              </button>
            </div>
            <AddGameProjectForm />
          </div>
        )}

        {openSection === "sanaa" && (
          <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                أرباح منصة صناع
              </h3>
              <button
                type="button"
                onClick={() => setOpenSection(null)}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                إغلاق
              </button>
            </div>
            <p className="mb-4 text-sm text-zinc-400">
              إضافة أرباح من المشاهدات والتعاونات — تُجمع مع إجمالي الأرباح في لوحة التحكم.
            </p>
            <AddSanaaEarningsForm />
          </div>
        )}

        {openSection === "courses" && (
          <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                أرباح بيع الكورسات
              </h3>
              <button
                type="button"
                onClick={() => setOpenSection(null)}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                إغلاق
              </button>
            </div>
            <p className="mb-4 text-sm text-zinc-400">
              إدخال اسم المنصة والأرباح التي جاءت منها — تُحسب ضمن إجمالي الأرباح.
            </p>
            <AddCourseSalesForm />
          </div>
        )}
      </div>
    </section>
  );
}
