import type { ReactNode } from "react";

type Accent = "cyan" | "emerald" | "amber";

const accents: Record<
  Accent,
  {
    bar: string;
    hoverBorder: string;
    hoverShadow: string;
    iconBg: string;
    iconRing: string;
    iconText: string;
  }
> = {
  cyan: {
    bar: "from-cyan-500/70",
    hoverBorder: "hover:border-cyan-500/35",
    hoverShadow: "hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)]",
    iconBg: "bg-cyan-500/12",
    iconRing: "ring-cyan-500/25",
    iconText: "text-cyan-400",
  },
  emerald: {
    bar: "from-emerald-500/70",
    hoverBorder: "hover:border-emerald-500/35",
    hoverShadow: "hover:shadow-[0_0_40px_-12px_rgba(52,211,153,0.3)]",
    iconBg: "bg-emerald-500/12",
    iconRing: "ring-emerald-500/25",
    iconText: "text-emerald-400",
  },
  amber: {
    bar: "from-amber-500/70",
    hoverBorder: "hover:border-amber-500/35",
    hoverShadow: "hover:shadow-[0_0_40px_-12px_rgba(251,191,36,0.28)]",
    iconBg: "bg-amber-500/12",
    iconRing: "ring-amber-500/25",
    iconText: "text-amber-400",
  },
};

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  accent: Accent;
  icon: ReactNode;
  className?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  accent,
  icon,
  className,
}: Props) {
  const a = accents[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900/95 via-zinc-900/80 to-zinc-950/60 p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.03] transition ${a.hoverBorder} ${a.hoverShadow} ${className ?? ""}`}
    >
      <div
        className={`pointer-events-none absolute start-0 top-0 h-full w-1 bg-gradient-to-b ${a.bar} to-transparent opacity-0 transition duration-300 group-hover:opacity-100`}
      />
      <div className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 rounded-full bg-white/[0.04] blur-2xl transition group-hover:bg-white/[0.06]" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-white">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
          ) : null}
        </div>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${a.iconBg} ring-1 ${a.iconRing} ${a.iconText} [&>svg]:h-6 [&>svg]:w-6`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
