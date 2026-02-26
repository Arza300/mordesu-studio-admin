"use client";

type Props = { message: string };

export default function LoadingOverlay({ message }: Props) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-zinc-950/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-cyan-500" />
      <p className="text-lg font-medium text-zinc-200">{message}</p>
    </div>
  );
}
