import { redirect } from "next/navigation";
import { getCurrentUser, isPendingUser } from "@/app/lib/auth";
import Link from "next/link";
import DashboardHeaderUser from "./DashboardHeaderUser";
import LogoutButton from "./LogoutButton";

export const runtime = "nodejs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (isPendingUser(user)) redirect("/pending");

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(34,211,238,0.11),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_left,#27272a35_1px,transparent_1px),linear-gradient(to_bottom,#27272a35_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.35]" />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-20 border-b border-zinc-800/90 bg-gradient-to-b from-zinc-950/98 via-zinc-950/95 to-zinc-950/90 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-xl backdrop-saturate-150">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <DashboardHeaderUser
                  user={{ id: user.id, email: user.email, name: user.name }}
                />
              ) : (
                <span className="flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-2 text-sm text-zinc-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700/90 text-zinc-200 ring-1 ring-zinc-600/50">
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                  {user.name || user.email}
                </span>
              )}
              <LogoutButton />
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-semibold tracking-tight text-white transition hover:text-cyan-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-cyan-600/10 text-sm font-bold text-cyan-300 ring-1 ring-cyan-500/25">
                M
              </span>
              <span className="hidden sm:inline">Mordesu Studio</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
