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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <DashboardHeaderUser
                user={{ id: user.id, email: user.email, name: user.name }}
              />
            ) : (
              <span className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm text-zinc-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-zinc-300">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </span>
                {user.name || user.email}
              </span>
            )}
            <LogoutButton />
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              M
            </span>
            <span className="hidden sm:inline">Mordesu Studio</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
