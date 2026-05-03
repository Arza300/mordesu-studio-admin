"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

export type SectionAccent =
  | "cyan"
  | "violet"
  | "amber"
  | "emerald"
  | "rose"
  | "teal"
  | "slate";

const accentStyles: Record<
  SectionAccent,
  {
    bar: string;
    iconWrap: string;
    headerOpen: string;
  }
> = {
  cyan: {
    bar: "from-cyan-500/75 via-cyan-500/40",
    iconWrap:
      "bg-cyan-500/12 text-cyan-300 ring-cyan-500/30 group-hover:bg-cyan-500/18",
    headerOpen: "bg-cyan-500/[0.07]",
  },
  violet: {
    bar: "from-violet-500/75 via-violet-500/40",
    iconWrap:
      "bg-violet-500/12 text-violet-300 ring-violet-500/30 group-hover:bg-violet-500/18",
    headerOpen: "bg-violet-500/[0.07]",
  },
  amber: {
    bar: "from-amber-500/75 via-amber-500/40",
    iconWrap:
      "bg-amber-500/12 text-amber-300 ring-amber-500/30 group-hover:bg-amber-500/18",
    headerOpen: "bg-amber-500/[0.07]",
  },
  emerald: {
    bar: "from-emerald-500/75 via-emerald-500/40",
    iconWrap:
      "bg-emerald-500/12 text-emerald-300 ring-emerald-500/30 group-hover:bg-emerald-500/18",
    headerOpen: "bg-emerald-500/[0.07]",
  },
  rose: {
    bar: "from-rose-500/75 via-rose-500/40",
    iconWrap:
      "bg-rose-500/12 text-rose-300 ring-rose-500/30 group-hover:bg-rose-500/18",
    headerOpen: "bg-rose-500/[0.07]",
  },
  teal: {
    bar: "from-teal-500/75 via-teal-500/40",
    iconWrap:
      "bg-teal-500/12 text-teal-300 ring-teal-500/30 group-hover:bg-teal-500/18",
    headerOpen: "bg-teal-500/[0.07]",
  },
  slate: {
    bar: "from-zinc-500/75 via-zinc-500/40",
    iconWrap:
      "bg-zinc-700/80 text-zinc-200 ring-zinc-600/60 group-hover:bg-zinc-700",
    headerOpen: "bg-zinc-800/50",
  },
};

type Props = {
  id?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string | number;
  /** مجموع الأرباح في هذه القائمة فقط — يظهر عند فتح القائمة */
  totalSum?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: SectionAccent;
};

export default function CollapsibleSection({
  id,
  title,
  description,
  icon,
  badge,
  totalSum,
  children,
  defaultOpen = false,
  accent = "cyan",
}: Props) {
  const [open, setOpen] = useState(() =>
    id ? false : defaultOpen,
  );
  const panelId = useId();
  const styles = accentStyles[accent];

  /** فتح القسم تلقائياً عند تطابق الرابط (#section-…) مع الشريط العلوي */
  useEffect(() => {
    if (!id) return;

    function syncOpenFromHash() {
      setOpen(typeof window !== "undefined" && window.location.hash === `#${id}`);
    }

    syncOpenFromHash();
    window.addEventListener("hashchange", syncOpenFromHash);
    return () => window.removeEventListener("hashchange", syncOpenFromHash);
  }, [id]);

  useEffect(() => {
    if (id) return;
    setOpen(defaultOpen);
  }, [id, defaultOpen]);

  const ariaControls = useMemo(
    () => (open ? panelId : undefined),
    [open, panelId],
  );

  return (
    <section
      id={id}
      className="scroll-mt-32 overflow-hidden rounded-2xl border border-zinc-800/75 bg-zinc-900/35 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.03]"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={ariaControls}
        className={`group relative flex min-h-[4.25rem] w-full items-center justify-between gap-4 px-5 py-4 text-start transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/45 sm:px-6 ${open ? styles.headerOpen : "hover:bg-zinc-800/30"}`}
      >
        <span
          className={`pointer-events-none absolute start-0 top-0 h-full w-1 bg-gradient-to-b ${styles.bar} to-transparent transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`}
          aria-hidden
        />
        <div className="relative flex min-w-0 flex-1 items-center gap-3 ps-1">
          {icon != null && (
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition [&>svg]:h-5 [&>svg]:w-5 ${styles.iconWrap}`}
              aria-hidden
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h2
              id={id ? `${id}-heading` : undefined}
              className="text-lg font-semibold leading-snug text-white"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-400">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="relative flex shrink-0 items-center gap-2.5">
          {badge !== undefined && (
            <span className="rounded-full border border-zinc-600/60 bg-zinc-900/90 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-zinc-100 ring-1 ring-white/5">
              {badge}
            </span>
          )}
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
            aria-hidden
          />
        </div>
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={id ? `${id}-heading` : undefined}
          className="border-t border-zinc-800/80 px-5 py-6 sm:px-6"
        >
          {totalSum !== undefined ? (
            <p className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-2.5 text-sm font-semibold text-emerald-300">
              مجموع الأرباح في هذه القائمة:{" "}
              {totalSum.toLocaleString("ar-EG")} جنيه مصري
            </p>
          ) : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}
