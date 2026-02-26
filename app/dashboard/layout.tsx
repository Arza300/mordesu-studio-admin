import { redirect } from "next/navigation";
import { getCurrentUser, isPendingViewer, requireAdmin } from "@/app/lib/auth";
import Link from "next/link";

export const runtime = "nodejs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (isPendingViewer(user)) redirect("/pending");
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              M
            </span>
            <span className="hidden sm:inline">Mordesu Studio</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              {admin.name || admin.email}
            </span>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
              >
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
