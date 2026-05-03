/** فئات مشتركة لجداول لوحة التحكم */

export const tableHeadRow =
  "border-b border-zinc-800/90 bg-gradient-to-b from-zinc-800/80 to-zinc-900/60";

export const tableTh =
  "px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-zinc-400";

export const tableBody = "divide-y divide-zinc-800/70";

export const tableRow =
  "border-zinc-800/40 transition hover:bg-zinc-800/35";

export const tableTd = "px-4 py-3 text-sm";

export const tableTdMuted = `${tableTd} text-zinc-400`;

export const tableTdStrong = `${tableTd} font-medium text-white`;

export const tableTdNums = `${tableTd} tabular-nums text-zinc-300`;

/** مجموعة أزرار الإجراءات في صف الجدول */
export const tableActionGroup = "flex flex-wrap items-center gap-2";

const btnBase =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:h-3.5 [&>svg]:w-3.5";

export const tableBtnDetails = `${btnBase} border-cyan-500/35 bg-cyan-500/10 text-cyan-200 hover:border-cyan-500/50 hover:bg-cyan-500/15 focus-visible:ring-cyan-500/45`;

export const tableBtnEdit = `${btnBase} border-amber-500/40 bg-amber-500/10 text-amber-200 hover:border-amber-500/55 hover:bg-amber-500/15 focus-visible:ring-amber-500/45`;

export const tableBtnDelete = `${btnBase} border-red-500/40 bg-red-500/10 text-red-200 hover:border-red-500/55 hover:bg-red-500/15 focus-visible:ring-red-500/45`;

export const tableBtnCyan = `${btnBase} border-cyan-500/35 bg-cyan-500/10 text-cyan-200 hover:border-cyan-500/50 hover:bg-cyan-500/15 focus-visible:ring-cyan-500/45`;
