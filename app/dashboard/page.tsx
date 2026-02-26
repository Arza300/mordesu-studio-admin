import { redirect } from "next/navigation";
import { type GameProject, Role } from "@prisma/client";
import {
  getCurrentUser,
  isPendingViewer,
  requireAdmin,
} from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import AddSectionsCards from "./AddSectionsCards";
import ClientsTable from "./ClientsTable";
import CollapsibleSection from "./CollapsibleSection";
import CourseSalesTable from "./CourseSalesTable";
import SanaaEarningsTable from "./SanaaEarningsTable";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (isPendingViewer(user)) redirect("/pending");

  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const [clients, stats] = await Promise.all([
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.aggregate({
      _sum: { pricePaid: true, featuresModificationsPrice: true },
      _count: true,
    }),
  ]);

  let gameProjects: GameProject[] = [];
  let gameProjectsSum = { _sum: { profits: null as number | null } };
  try {
    [gameProjects, gameProjectsSum] = await Promise.all([
      prisma.gameProject.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.gameProject.aggregate({ _sum: { profits: true } }),
    ]);
  } catch {
    // جدول GameProject غير موجود بعد — تشغيل scripts/add-game-projects-table.sql أو npx prisma db push
  }

  let sanaaSum = { viewsAmount: 0, collaborationsAmount: 0 };
  let sanaaEntries: { id: string; viewsAmount: number; collaborationsAmount: number; createdAt: Date }[] = [];
  try {
    const [sanaaAgg, sanaaList] = await Promise.all([
      prisma.sanaaEarningsEntry.aggregate({
        _sum: { viewsAmount: true, collaborationsAmount: true },
      }),
      prisma.sanaaEarningsEntry.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    sanaaSum = {
      viewsAmount: sanaaAgg._sum.viewsAmount ?? 0,
      collaborationsAmount: sanaaAgg._sum.collaborationsAmount ?? 0,
    };
    sanaaEntries = sanaaList;
  } catch {
    // جدول SanaaEarningsEntry غير موجود بعد — npx prisma db push
  }

  let courseSalesSum = 0;
  let courseSalesEntries: { id: string; platformName: string; profits: number; createdAt: Date }[] = [];
  try {
    const [courseAgg, courseList] = await Promise.all([
      prisma.courseSalesEntry.aggregate({ _sum: { profits: true } }),
      prisma.courseSalesEntry.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    courseSalesSum = courseAgg._sum.profits ?? 0;
    courseSalesEntries = courseList;
  } catch {
    // جدول CourseSalesEntry غير موجود بعد — npx prisma db push
  }

  const totalRevenue =
    (stats._sum.pricePaid ?? 0) +
    (stats._sum.featuresModificationsPrice ?? 0) +
    (gameProjectsSum._sum.profits ?? 0) +
    sanaaSum.viewsAmount +
    sanaaSum.collaborationsAmount +
    courseSalesSum;

  const pendingUsers = await prisma.user.findMany({
    where: { role: { in: [Role.VIEWER, Role.USER] } },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          لوحة التحكم
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          إدارة العملاء والحسابات والمراجعات
        </p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 p-6 shadow-lg transition hover:border-cyan-500/30 hover:shadow-cyan-500/5">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-500/60 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                إجمالي العملاء
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-white">
                {stats._count.toLocaleString("ar-EG")}
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl text-cyan-400">
              👥
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 p-6 shadow-lg transition hover:border-emerald-500/30 hover:shadow-emerald-500/5">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500/60 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                إجمالي الأرباح
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-white">
                {totalRevenue.toLocaleString("ar-EG")}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">وحدة العملة</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl text-emerald-400">
              💰
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 p-6 shadow-lg transition hover:border-amber-500/30 hover:shadow-amber-500/5 sm:col-span-2 lg:col-span-1">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-500/60 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                قيد المراجعة
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-white">
                {pendingUsers.length.toLocaleString("ar-EG")}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">حساب متفرج</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl text-amber-400">
              ⏳
            </span>
          </div>
        </div>
      </div>

      {/* إضافة عميل جديد / إضافة مشاريع — زرّان مربعيان يفتحان النموذج */}
      <AddSectionsCards />

      {/* قائمة أرباح منصة صناع */}
      <CollapsibleSection
        title="قائمة أرباح منصة صناع"
        description="سجلات أرباح المشاهدات والتعاونات — يمكن التعديل أو الحذف"
        icon="📺"
        badge={sanaaEntries.length}
      >
        <SanaaEarningsTable entries={sanaaEntries} />
      </CollapsibleSection>

      {/* قائمة أرباح بيع الكورسات */}
      <CollapsibleSection
        title="قائمة أرباح بيع الكورسات"
        description="سجلات المنصات والأرباح — يمكن التعديل أو الحذف"
        icon="📚"
        badge={courseSalesEntries.length}
      >
        <CourseSalesTable entries={courseSalesEntries} />
      </CollapsibleSection>

      {/* قائمة مشاريع الألعاب */}
      <CollapsibleSection
        title="قائمة مشاريع الألعاب"
        description="المشاريع المضافة وأرباحها ونوعها (خاص / تابع لمستثمر)"
        icon="🎮"
        badge={gameProjects.length}
      >
        {gameProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/20 py-12 text-center">
              <span className="mb-2 text-3xl opacity-60">🎮</span>
              <p className="text-sm font-medium text-zinc-400">
                لا توجد مشاريع حتى الآن
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                أضف مشاريع من القسم أعلاه
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-800/80">
              <table className="min-w-full text-right">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      اسم اللعبة
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      الأرباح
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      رابط المشروع
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      نوع المشروع
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {gameProjects.map((p) => (
                    <tr key={p.id} className="transition hover:bg-zinc-800/30">
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-sm tabular-nums text-zinc-300">
                        {p.profits.toLocaleString("ar-EG")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {p.projectLink ? (
                          <a
                            href={p.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline"
                          >
                            رابط
                          </a>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-400">
                        {p.projectType === "INVESTOR" ? "تابع لمستثمر" : "مشروع خاص"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </CollapsibleSection>

      {/* إدارة العملاء */}
      <CollapsibleSection
        title="إدارة العملاء"
        description="قائمة منصات العملاء المسجّلين لدى الاستوديو"
        icon="👥"
        badge={clients.length}
      >
        {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/20 py-16 text-center">
              <span className="mb-3 text-4xl opacity-60">📋</span>
              <p className="text-sm font-medium text-zinc-400">
                لا يوجد عملاء حتى الآن
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                ستظهر هنا بيانات العملاء بعد إضافتهم من لوحة التحكم
              </p>
            </div>
          ) : (
            <ClientsTable clients={clients} />
          )}
      </CollapsibleSection>

      {/* قسم الحسابات قيد المراجعة */}
      <CollapsibleSection
        title="الحسابات قيد المراجعة"
        description="حسابات المتفرجين في انتظار الموافقة لترقيتهم إلى أدمن"
        icon="⏳"
        badge={pendingUsers.length}
      >
        {pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/20 py-16 text-center">
              <span className="mb-3 text-4xl opacity-60">✅</span>
              <p className="text-sm font-medium text-zinc-400">
                لا يوجد حسابات في انتظار الموافقة
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                الحسابات الجديدة ستظهر هنا حتى يتم ترقيتها
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-800/80">
              <table className="min-w-full text-right">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      البريد
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      الاسم
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      تاريخ التسجيل
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      إجراء
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {pendingUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="transition hover:bg-zinc-800/30"
                    >
                      <td className="px-4 py-3 text-sm text-zinc-300" dir="ltr">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {u.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">
                        {new Date(u.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <PromoteButton userId={u.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </CollapsibleSection>
    </div>
  );
}

function PromoteButton({ userId }: { userId: string }) {
  return (
    <form action="/api/admin/users/promote" method="post">
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500 hover:shadow-cyan-500/30"
      >
        ترقية إلى أدمن
      </button>
    </form>
  );
}
