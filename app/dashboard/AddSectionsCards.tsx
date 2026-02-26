"use client";

import { useState } from "react";
import AddClientForm from "./AddClientForm";
import AddGameProjectForm from "./AddGameProjectForm";
import AddCourseSalesForm from "./AddCourseSalesForm";
import AddCollaborationForm from "./AddCollaborationForm";
import AddOtherProfitsForm from "./AddOtherProfitsForm";
import AddSanaaEarningsForm from "./AddSanaaEarningsForm";

type OpenSection = "client" | "game" | "sanaa" | "courses" | "other" | "collaborations" | null;

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
        <div className="mx-auto grid max-w-[1300px] grid-cols-2 justify-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "client" ? null : "client"))}
            className="group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/50 px-4 py-4 text-right transition hover:border-cyan-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-cyan-500/60 data-[open=true]:bg-cyan-500/5 data-[open=true]:ring-2 data-[open=true]:ring-cyan-500/30"
            data-open={openSection === "client"}
          >
            <span className="text-2xl opacity-80" aria-hidden>👤</span>
            <span className="text-base font-semibold leading-tight text-white">إضافة عميل جديد</span>
            <span className="text-sm leading-tight text-zinc-400">بيانات العميل والمنصة</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "game" ? null : "game"))}
            className="group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/50 px-4 py-4 text-right transition hover:border-emerald-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-emerald-500/60 data-[open=true]:bg-emerald-500/5 data-[open=true]:ring-2 data-[open=true]:ring-emerald-500/30"
            data-open={openSection === "game"}
          >
            <span className="text-2xl opacity-80" aria-hidden>🎮</span>
            <span className="text-base font-semibold leading-tight text-white">إضافة مشاريع (UE5)</span>
            <span className="text-sm leading-tight text-zinc-400">مشاريع الألعاب</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "sanaa" ? null : "sanaa"))}
            className="group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/50 px-4 py-4 text-right transition hover:border-amber-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-amber-500/60 data-[open=true]:bg-amber-500/5 data-[open=true]:ring-2 data-[open=true]:ring-amber-500/30"
            data-open={openSection === "sanaa"}
          >
            <span className="text-2xl opacity-80" aria-hidden>📺</span>
            <span className="text-base font-semibold leading-tight text-white">أرباح منصة صناع</span>
            <span className="text-sm leading-tight text-zinc-400">مشاهدات وتعاونات</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "courses" ? null : "courses"))}
            className="group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/50 px-4 py-4 text-right transition hover:border-violet-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-violet-500/60 data-[open=true]:bg-violet-500/5 data-[open=true]:ring-2 data-[open=true]:ring-violet-500/30"
            data-open={openSection === "courses"}
          >
            <span className="text-2xl opacity-80" aria-hidden>📚</span>
            <span className="text-base font-semibold leading-tight text-white">أرباح بيع الكورسات</span>
            <span className="text-sm leading-tight text-zinc-400">اسم المنصة والأرباح</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "other" ? null : "other"))}
            className="group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/50 px-4 py-4 text-right transition hover:border-rose-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-rose-500/60 data-[open=true]:bg-rose-500/5 data-[open=true]:ring-2 data-[open=true]:ring-rose-500/30"
            data-open={openSection === "other"}
          >
            <span className="text-2xl opacity-80" aria-hidden>💰</span>
            <span className="text-base font-semibold leading-tight text-white">أرباح أخرى</span>
            <span className="text-sm leading-tight text-zinc-400">سبب الربح والربح</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenSection((s) => (s === "collaborations" ? null : "collaborations"))}
            className="group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/50 px-4 py-4 text-right transition hover:border-teal-500/50 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 data-[open=true]:border-teal-500/60 data-[open=true]:bg-teal-500/5 data-[open=true]:ring-2 data-[open=true]:ring-teal-500/30"
            data-open={openSection === "collaborations"}
          >
            <span className="text-2xl opacity-80" aria-hidden>🤝</span>
            <span className="text-base font-semibold leading-tight text-white">تعاونات الاستوديو</span>
            <span className="text-sm leading-tight text-zinc-400">وصف التعاون والربح العائد</span>
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

        {openSection === "other" && (
          <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                أرباح أخرى
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
              إدخال سبب الربح ومبلغ الربح — تُحسب ضمن إجمالي الأرباح.
            </p>
            <AddOtherProfitsForm />
          </div>
        )}

        {openSection === "collaborations" && (
          <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                تعاونات الاستوديو
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
              إدخال وصف التعاون والربح العائد — يُحسب ضمن إجمالي الأرباح.
            </p>
            <AddCollaborationForm />
          </div>
        )}

      </div>
    </section>
  );
}
