"use client";

import { useState, type ReactNode } from "react";
import {
  Gamepad2,
  HeartHandshake,
  MonitorPlay,
  UserPlus,
  Wallet,
  BookOpen,
  X,
} from "lucide-react";
import AddClientForm from "./AddClientForm";
import AddGameProjectForm from "./AddGameProjectForm";
import AddCourseSalesForm from "./AddCourseSalesForm";
import AddCollaborationForm from "./AddCollaborationForm";
import AddOtherProfitsForm from "./AddOtherProfitsForm";
import AddSanaaEarningsForm from "./AddSanaaEarningsForm";

type OpenSection =
  | "client"
  | "game"
  | "sanaa"
  | "courses"
  | "other"
  | "collaborations"
  | null;

const actionButtonClass =
  "group flex min-h-[7.5rem] min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-700/70 bg-zinc-800/40 px-3 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-800/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export default function AddSectionsCards() {
  const [openSection, setOpenSection] = useState<OpenSection>(null);

  return (
    <section
      id="section-add"
      className="scroll-mt-32 overflow-hidden rounded-2xl border border-zinc-800/75 bg-gradient-to-b from-zinc-900/50 to-zinc-950/40 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.03]"
    >
      <div className="border-b border-zinc-800/80 bg-zinc-900/30 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-white">إضافة بيانات</h2>
        <p className="mt-1 text-sm text-zinc-400">
          اختر نوع السجل ثم املأ النموذج — العملاء والمشاريع أو مصادر الإيرادات
        </p>
      </div>
      <div className="space-y-8 p-5 sm:p-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            العملاء والمشاريع
          </p>
          <div className="grid max-w-[1100px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <button
              type="button"
              onClick={() =>
                setOpenSection((s) => (s === "client" ? null : "client"))
              }
              className={`${actionButtonClass} data-[open=true]:border-cyan-500/50 data-[open=true]:bg-cyan-500/[0.07] data-[open=true]:ring-2 data-[open=true]:ring-cyan-500/35 focus-visible:ring-cyan-500/45`}
              data-open={openSection === "client"}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/25 transition group-hover:bg-cyan-500/20"
                aria-hidden
              >
                <UserPlus className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="text-base font-semibold leading-tight text-white">
                إضافة عميل جديد
              </span>
              <span className="text-sm leading-tight text-zinc-400">
                بيانات العميل والمنصة
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpenSection((s) => (s === "game" ? null : "game"))}
              className={`${actionButtonClass} data-[open=true]:border-emerald-500/50 data-[open=true]:bg-emerald-500/[0.07] data-[open=true]:ring-2 data-[open=true]:ring-emerald-500/35 focus-visible:ring-emerald-500/45`}
              data-open={openSection === "game"}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25 transition group-hover:bg-emerald-500/20"
                aria-hidden
              >
                <Gamepad2 className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="text-base font-semibold leading-tight text-white">
                إضافة مشاريع (UE5)
              </span>
              <span className="text-sm leading-tight text-zinc-400">
                مشاريع الألعاب
              </span>
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            مصادر الإيرادات والتعاونات
          </p>
          <div className="grid max-w-[1300px] grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            <button
              type="button"
              onClick={() =>
                setOpenSection((s) => (s === "sanaa" ? null : "sanaa"))
              }
              className={`${actionButtonClass} data-[open=true]:border-amber-500/50 data-[open=true]:bg-amber-500/[0.07] data-[open=true]:ring-2 data-[open=true]:ring-amber-500/35 focus-visible:ring-amber-500/45`}
              data-open={openSection === "sanaa"}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25 transition group-hover:bg-amber-500/20"
                aria-hidden
              >
                <MonitorPlay className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold leading-tight text-white sm:text-base">
                أرباح منصة صناع
              </span>
              <span className="text-xs leading-tight text-zinc-400 sm:text-sm">
                مشاهدات وتعاونات
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenSection((s) => (s === "courses" ? null : "courses"))
              }
              className={`${actionButtonClass} data-[open=true]:border-violet-500/50 data-[open=true]:bg-violet-500/[0.07] data-[open=true]:ring-2 data-[open=true]:ring-violet-500/35 focus-visible:ring-violet-500/45`}
              data-open={openSection === "courses"}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/25 transition group-hover:bg-violet-500/20"
                aria-hidden
              >
                <BookOpen className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold leading-tight text-white sm:text-base">
                أرباح بيع الكورسات
              </span>
              <span className="text-xs leading-tight text-zinc-400 sm:text-sm">
                اسم المنصة والأرباح
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpenSection((s) => (s === "other" ? null : "other"))}
              className={`${actionButtonClass} data-[open=true]:border-rose-500/50 data-[open=true]:bg-rose-500/[0.07] data-[open=true]:ring-2 data-[open=true]:ring-rose-500/35 focus-visible:ring-rose-500/45`}
              data-open={openSection === "other"}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/25 transition group-hover:bg-rose-500/20"
                aria-hidden
              >
                <Wallet className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold leading-tight text-white sm:text-base">
                أرباح أخرى
              </span>
              <span className="text-xs leading-tight text-zinc-400 sm:text-sm">
                سبب الربح والمبلغ
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenSection((s) =>
                  s === "collaborations" ? null : "collaborations",
                )
              }
              className={`${actionButtonClass} data-[open=true]:border-teal-500/50 data-[open=true]:bg-teal-500/[0.07] data-[open=true]:ring-2 data-[open=true]:ring-teal-500/35 focus-visible:ring-teal-500/45`}
              data-open={openSection === "collaborations"}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-400 ring-1 ring-teal-500/25 transition group-hover:bg-teal-500/20"
                aria-hidden
              >
                <HeartHandshake className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold leading-tight text-white sm:text-base">
                تعاونات الاستوديو
              </span>
              <span className="text-xs leading-tight text-zinc-400 sm:text-sm">
                وصف التعاون والربح
              </span>
            </button>
          </div>
        </div>

        {openSection === "client" && (
          <FormPanel
            title="إضافة عميل جديد"
            onClose={() => setOpenSection(null)}
          >
            <AddClientForm />
          </FormPanel>
        )}

        {openSection === "game" && (
          <FormPanel
            title="إضافة مشاريع (Unreal Engine 5)"
            onClose={() => setOpenSection(null)}
          >
            <AddGameProjectForm />
          </FormPanel>
        )}

        {openSection === "sanaa" && (
          <FormPanel
            title="أرباح منصة صناع"
            onClose={() => setOpenSection(null)}
            intro="إضافة أرباح من المشاهدات والتعاونات — تُجمع مع إجمالي الأرباح في لوحة التحكم."
          >
            <AddSanaaEarningsForm />
          </FormPanel>
        )}

        {openSection === "courses" && (
          <FormPanel
            title="أرباح بيع الكورسات"
            onClose={() => setOpenSection(null)}
            intro="إدخال اسم المنصة والأرباح التي جاءت منها — تُحسب ضمن إجمالي الأرباح."
          >
            <AddCourseSalesForm />
          </FormPanel>
        )}

        {openSection === "other" && (
          <FormPanel
            title="أرباح أخرى"
            onClose={() => setOpenSection(null)}
            intro="إدخال سبب الربح ومبلغ الربح — تُحسب ضمن إجمالي الأرباح."
          >
            <AddOtherProfitsForm />
          </FormPanel>
        )}

        {openSection === "collaborations" && (
          <FormPanel
            title="تعاونات الاستوديو"
            onClose={() => setOpenSection(null)}
            intro="إدخال وصف التعاون والربح العائد — يُحسب ضمن إجمالي الأرباح."
          >
            <AddCollaborationForm />
          </FormPanel>
        )}
      </div>
    </section>
  );
}

function FormPanel({
  title,
  intro,
  onClose,
  children,
}: {
  title: string;
  intro?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-inner ring-1 ring-white/[0.02] sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-zinc-800/70 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {intro ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-400">
              {intro}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-zinc-700/80 bg-zinc-800/60 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/45"
        >
          <X className="h-4 w-4" aria-hidden />
          إغلاق
        </button>
      </div>
      {children}
    </div>
  );
}
