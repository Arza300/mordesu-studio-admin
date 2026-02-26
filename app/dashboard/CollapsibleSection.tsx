"use client";

import { useState } from "react";

type Props = {
  title: string;
  description?: string;
  icon?: string;
  badge?: string | number;
  /** مجموع الأرباح في هذه القائمة فقط — يظهر عند فتح القائمة */
  totalSum?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function CollapsibleSection({
  title,
  description,
  icon,
  badge,
  totalSum,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 shadow-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-right transition hover:bg-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:ring-inset"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="text-2xl opacity-80" aria-hidden>
              {icon}
            </span>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-sm text-zinc-400">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge !== undefined && (
            <span className="rounded-full bg-zinc-700/80 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
              {badge}
            </span>
          )}
          <span
            className={`inline-block text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            ▼
          </span>
        </div>
      </button>
      {open && (
        <div className="border-t border-zinc-800/80 p-6">
          {totalSum !== undefined && (
            <p className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              مجموع الأرباح في هذه القائمة: {totalSum.toLocaleString("ar-EG")} جنيه مصري
            </p>
          )}
          {children}
        </div>
      )}
    </section>
  );
}
