import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export default function SectionEmptyState({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700/55 bg-zinc-900/30 px-4 py-12 text-center ring-1 ring-white/[0.02]">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/70 text-zinc-500 ring-1 ring-zinc-700/70">
        <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden />
      </span>
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}
