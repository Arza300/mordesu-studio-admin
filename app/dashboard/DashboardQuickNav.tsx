"use client";

type NavItem = {
  href: string;
  label: string;
};

type Props = {
  items: NavItem[];
};

export default function DashboardQuickNav({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="تنقل سريع في لوحة التحكم"
      className="sticky top-16 z-10 -mx-4 border-b border-zinc-800/80 bg-zinc-950/85 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/70 sm:-mx-6 sm:px-6 md:rounded-xl md:border md:border-zinc-800/70 md:bg-zinc-900/50 md:py-2.5 md:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => {
              if (typeof window === "undefined") return;
              // نفس الـ # لا يُطلق hashchange في المتصفح — نُرسل حدثاً لإعادة فتح القسم
              if (window.location.hash === item.href) {
                e.preventDefault();
                window.dispatchEvent(new Event("hashchange"));
              }
            }}
            className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-zinc-700/80 bg-zinc-900/70 px-3.5 py-2 text-sm font-medium text-zinc-300 ring-zinc-800/80 transition hover:border-cyan-500/40 hover:bg-zinc-800/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
