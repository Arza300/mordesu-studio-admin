import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** شريط علوي ملون خفيف اختياري لتمييز الجدول ضمن قسم */
  accentBar?: boolean;
};

export default function DataTableShell({ children, accentBar = true }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/35 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.03]">
      {accentBar ? (
        <div
          className="h-0.5 bg-gradient-to-l from-transparent via-zinc-600/50 to-transparent"
          aria-hidden
        />
      ) : null}
      {children}
    </div>
  );
}
