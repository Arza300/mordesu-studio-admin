import { redirect } from "next/navigation";
import { type GameProject, Role } from "@prisma/client";
import {
  Users,
  Wallet,
  Hourglass,
  Tv,
  BookOpen,
  Coins,
  Handshake,
  Gamepad2,
  ClipboardList,
  UserCog,
} from "lucide-react";
import { getCurrentUser, isPendingUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import AddSectionsCards from "./AddSectionsCards";
import ClientsTable from "./ClientsTable";
import CollapsibleSection from "./CollapsibleSection";
import CollaborationsTable from "./CollaborationsTable";
import CourseSalesTable from "./CourseSalesTable";
import DashboardQuickNav from "./DashboardQuickNav";
import OtherProfitsTable from "./OtherProfitsTable";
import SanaaEarningsTable from "./SanaaEarningsTable";
import StatCard from "./StatCard";
import UsersManagementTable from "./UsersManagementTable";
import DataTableShell from "./ui/DataTableShell";
import SectionEmptyState from "./ui/SectionEmptyState";
import {
  tableBody,
  tableHeadRow,
  tableRow,
  tableTd,
  tableTdNums,
  tableTdStrong,
  tableTh,
} from "./ui/tableClasses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (isPendingUser(user)) redirect("/pending");

  const isAdmin = user.role === "ADMIN";

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
  let sanaaEntries: {
    id: string;
    viewsAmount: number;
    collaborationsAmount: number;
    createdAt: Date;
  }[] = [];
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
  let courseSalesEntries: {
    id: string;
    platformName: string;
    profits: number;
    createdAt: Date;
  }[] = [];
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

  let otherProfitsSum = 0;
  let otherProfitsEntries: {
    id: string;
    reason: string;
    profit: number;
    createdAt: Date;
  }[] = [];
  try {
    const [otherAgg, otherList] = await Promise.all([
      prisma.otherProfitsEntry.aggregate({ _sum: { profit: true } }),
      prisma.otherProfitsEntry.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    otherProfitsSum = otherAgg._sum.profit ?? 0;
    otherProfitsEntries = otherList;
  } catch {
    // جدول OtherProfitsEntry غير موجود بعد — npx prisma db push
  }

  let collaborationsSum = 0;
  let collaborationEntries: {
    id: string;
    description: string;
    monetaryBenefit: number;
    createdAt: Date;
  }[] = [];
  try {
    const [collabAgg, collabList] = await Promise.all([
      prisma.studioCollaboration.aggregate({ _sum: { monetaryBenefit: true } }),
      prisma.studioCollaboration.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    collaborationsSum = collabAgg._sum.monetaryBenefit ?? 0;
    collaborationEntries = collabList;
  } catch {
    // جدول StudioCollaboration غير موجود بعد — npx prisma db push
  }

  const totalRevenue =
    (stats._sum.pricePaid ?? 0) +
    (stats._sum.featuresModificationsPrice ?? 0) +
    (gameProjectsSum._sum.profits ?? 0) +
    sanaaSum.viewsAmount +
    sanaaSum.collaborationsAmount +
    courseSalesSum +
    otherProfitsSum +
    collaborationsSum;

  const pendingUsers = await prisma.user.findMany({
    where: { role: Role.USER },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const allUsers = isAdmin
    ? await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      })
    : [];

  const clientsForTable = isAdmin ? clients : clients.map((c) => ({ ...c, phone: "" }));

  const displayName = user.name?.trim() || user.email.split("@")[0];

  const quickNavItems = [
    { href: "#section-overview", label: "نظرة عامة" },
    ...(isAdmin ? [{ href: "#section-add", label: "إضافة بيانات" }] : []),
    { href: "#section-sanaa", label: "أرباح صناع" },
    { href: "#section-courses", label: "الكورسات" },
    { href: "#section-other", label: "أرباح أخرى" },
    { href: "#section-collabs", label: "التعاونات" },
    { href: "#section-games", label: "مشاريع الألعاب" },
    { href: "#section-clients", label: "العملاء" },
    ...(isAdmin ? [{ href: "#section-users", label: "المستخدمين" }] : []),
  ];

  return (
    <div className="space-y-8">
      <div id="section-overview" className="scroll-mt-32 space-y-6">
        <div className="flex flex-col gap-2 border-b border-zinc-800/60 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500/90">
              Mordesu Studio
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              لوحة التحكم
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              مرحباً، {displayName}. تتبّع العملاء، الأرباح، والمراجعات من مكان
              واحد.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="إجمالي العملاء"
            value={stats._count.toLocaleString("ar-EG")}
            accent="cyan"
            icon={<Users className="h-6 w-6" strokeWidth={2} />}
          />
          <StatCard
            title="إجمالي الأرباح"
            value={totalRevenue.toLocaleString("ar-EG")}
            subtitle="جنيه مصري"
            accent="emerald"
            icon={<Wallet className="h-6 w-6" strokeWidth={2} />}
          />
          <StatCard
            title="قيد المراجعة"
            value={pendingUsers.length.toLocaleString("ar-EG")}
            subtitle="في انتظار موافقة الأدمن"
            accent="amber"
            icon={<Hourglass className="h-6 w-6" strokeWidth={2} />}
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>
      </div>

      <DashboardQuickNav items={quickNavItems} />

      {isAdmin ? <AddSectionsCards /> : null}

      <CollapsibleSection
        id="section-sanaa"
        accent="amber"
        title="قائمة أرباح منصة صناع"
        description={
          isAdmin
            ? "سجلات أرباح المشاهدات والتعاونات — يمكن التعديل أو الحذف"
            : "سجلات أرباح المشاهدات والتعاونات"
        }
        icon={<Tv className="h-5 w-5" strokeWidth={2} />}
        badge={sanaaEntries.length}
        totalSum={sanaaSum.viewsAmount + sanaaSum.collaborationsAmount}
      >
        <SanaaEarningsTable entries={sanaaEntries} canEdit={isAdmin} />
      </CollapsibleSection>

      <CollapsibleSection
        id="section-courses"
        accent="violet"
        title="قائمة أرباح بيع الكورسات"
        description={
          isAdmin
            ? "سجلات المنصات والأرباح — يمكن التعديل أو الحذف"
            : "سجلات المنصات والأرباح"
        }
        icon={<BookOpen className="h-5 w-5" strokeWidth={2} />}
        badge={courseSalesEntries.length}
        totalSum={courseSalesSum}
      >
        <CourseSalesTable entries={courseSalesEntries} canEdit={isAdmin} />
      </CollapsibleSection>

      <CollapsibleSection
        id="section-other"
        accent="rose"
        title="قائمة أرباح أخرى"
        description={
          isAdmin
            ? "سجلات سبب الربح والربح — يمكن التعديل أو الحذف"
            : "سجلات سبب الربح والربح"
        }
        icon={<Coins className="h-5 w-5" strokeWidth={2} />}
        badge={otherProfitsEntries.length}
        totalSum={otherProfitsSum}
      >
        <OtherProfitsTable entries={otherProfitsEntries} canEdit={isAdmin} />
      </CollapsibleSection>

      <CollapsibleSection
        id="section-collabs"
        accent="teal"
        title="قائمة تعاونات الاستوديو"
        description={
          isAdmin
            ? "تعاونات الاستوديو — يمكن التعديل أو الحذف. الربح العائد ضمن إجمالي الأرباح."
            : "تعاونات الاستوديو — الربح العائد ضمن إجمالي الأرباح."
        }
        icon={<Handshake className="h-5 w-5" strokeWidth={2} />}
        badge={collaborationEntries.length}
        totalSum={collaborationsSum}
      >
        <CollaborationsTable entries={collaborationEntries} canEdit={isAdmin} />
      </CollapsibleSection>

      <CollapsibleSection
        id="section-games"
        accent="emerald"
        title="قائمة مشاريع الألعاب"
        description="المشاريع المضافة وأرباحها ونوعها (خاص / تابع لمستثمر)"
        icon={<Gamepad2 className="h-5 w-5" strokeWidth={2} />}
        badge={gameProjects.length}
        totalSum={gameProjectsSum._sum.profits ?? 0}
      >
        {gameProjects.length === 0 ? (
          <SectionEmptyState
            icon={Gamepad2}
            title="لا توجد مشاريع حتى الآن"
            description='أضف مشاريع من قسم «إضافة بيانات» أعلاه'
          />
        ) : (
          <DataTableShell>
            <table className="min-w-full text-start">
              <thead>
                <tr className={tableHeadRow}>
                  <th className={tableTh}>اسم اللعبة</th>
                  <th className={tableTh}>الأرباح</th>
                  <th className={tableTh}>رابط المشروع</th>
                  <th className={tableTh}>نوع المشروع</th>
                </tr>
              </thead>
              <tbody className={tableBody}>
                {gameProjects.map((p) => (
                  <tr key={p.id} className={tableRow}>
                    <td className={tableTdStrong}>{p.name}</td>
                    <td className={tableTdNums}>
                      {p.profits.toLocaleString("ar-EG")}
                    </td>
                    <td className={tableTd}>
                      {p.projectLink ? (
                        <a
                          href={p.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-cyan-400 underline-offset-2 hover:text-cyan-300 hover:underline"
                        >
                          رابط
                        </a>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>
                    <td className={`${tableTd} text-zinc-400`}>
                      {p.projectType === "INVESTOR"
                        ? "تابع لمستثمر"
                        : "مشروع خاص"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTableShell>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        id="section-clients"
        accent="cyan"
        title="إدارة العملاء"
        description="قائمة منصات العملاء المسجّلين لدى الاستوديو"
        icon={<Users className="h-5 w-5" strokeWidth={2} />}
        badge={clients.length}
        totalSum={
          (stats._sum.pricePaid ?? 0) +
          (stats._sum.featuresModificationsPrice ?? 0)
        }
      >
        {clients.length === 0 ? (
          <SectionEmptyState
            icon={ClipboardList}
            title="لا يوجد عملاء حتى الآن"
            description="ستظهر هنا بيانات العملاء بعد إضافتهم من لوحة التحكم"
          />
        ) : (
          <ClientsTable
            clients={clientsForTable}
            canEdit={isAdmin}
            hidePhone={!isAdmin}
          />
        )}
      </CollapsibleSection>

      {isAdmin ? (
        <CollapsibleSection
          id="section-users"
          accent="slate"
          title="إدارة المستخدمين"
          description="عرض كل الحسابات — تعديل البيانات أو الرتبة أو حذف الحساب"
          icon={<UserCog className="h-5 w-5" strokeWidth={2} />}
          badge={allUsers.length}
        >
          <UsersManagementTable users={allUsers} currentUserId={user.id} />
        </CollapsibleSection>
      ) : null}
    </div>
  );
}
