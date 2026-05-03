"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Prisma } from "@prisma/client";
import {
  Copy,
  Check,
  X,
  User,
  FolderKanban,
  RefreshCw,
} from "lucide-react";
import {
  parseProjectAccountsFromDb,
  parseSubscriptionsFromDb,
} from "@/app/lib/client-extras";

const valueBox =
  "rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 ring-1 ring-white/[0.02]";

type Client = {
  id: string;
  name: string;
  platformName: string;
  phone: string;
  platformUrl: string;
  pricePaid: number;
  featuresModificationsPrice?: number | null;
  projectAccounts?: Prisma.JsonValue | null;
  subscriptions?: Prisma.JsonValue | null;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  if (parts.length === 1 && parts[0].length >= 2)
    return parts[0].slice(0, 2).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || "?";
}

function CopyIconButton({
  text,
  disabled,
}: {
  text: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (disabled || !text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !text.trim()}
      className="inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-600/80 bg-zinc-800/80 p-1.5 text-zinc-400 transition hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:pointer-events-none disabled:opacity-40"
      aria-label="نسخ إلى الحافظة"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 shadow-inner ring-1 ring-white/[0.03] sm:p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-800/60 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/90 text-cyan-400 ring-1 ring-zinc-700/80">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function FieldRow({
  label,
  copyText,
  children,
}: {
  label: string;
  copyText?: string;
  children: ReactNode;
}) {
  const showCopy = copyText !== undefined && copyText !== "" && copyText !== "—";

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-500">{label}</span>
        {showCopy ? <CopyIconButton text={copyText} /> : null}
      </div>
      <div className={valueBox}>{children}</div>
    </div>
  );
}

export default function ClientDetailsModal({
  client,
  onClose,
  hidePhone = false,
}: {
  client: Client;
  onClose: () => void;
  hidePhone?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pa = parseProjectAccountsFromDb(client.projectAccounts);
  const sub = parseSubscriptionsFromDb(client.subscriptions);

  const hasAnyProjectSection = pa.githubEnabled || pa.projectLinkEnabled;

  const subscriptionRows = sub.hasSubscriptions
    ? sub.entries.filter(
        (e) =>
          e.email.trim() !== "" ||
          e.password !== "" ||
          e.details.trim() !== "",
      )
    : [];

  const readOnlyInput =
    "w-full rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 ring-1 ring-white/[0.02]";

  const initials = initialsFromName(client.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-details-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl ring-1 ring-white/10">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-800/90 bg-gradient-to-br from-cyan-950/35 via-zinc-900 to-zinc-950 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-base font-bold text-cyan-300 ring-1 ring-cyan-500/35"
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h2
                id="client-details-title"
                className="text-lg font-semibold tracking-tight text-white"
              >
                تفاصيل العميل
              </h2>
              <p className="truncate text-sm text-zinc-400">
                {client.name} — {client.platformName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-transparent p-2 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-4 sm:p-6">
          <SectionCard
            title="البيانات الأساسية"
            icon={<User className="h-4 w-4" aria-hidden />}
          >
            <dl className="grid gap-4 sm:grid-cols-2">
              <FieldRow label="اسم العميل" copyText={client.name}>
                {client.name}
              </FieldRow>
              <FieldRow label="اسم المنصة" copyText={client.platformName}>
                {client.platformName}
              </FieldRow>
              <FieldRow
                label="الهاتف"
                copyText={hidePhone ? undefined : client.phone}
              >
                <span dir="ltr" className="block text-start">
                  {hidePhone ? "—" : client.phone}
                </span>
              </FieldRow>
              <FieldRow label="رابط الموقع" copyText={client.platformUrl}>
                <a
                  href={client.platformUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-cyan-400 underline-offset-2 hover:text-cyan-300 hover:underline"
                  dir="ltr"
                >
                  {client.platformUrl}
                </a>
              </FieldRow>
              <FieldRow
                label="تكلفة المنصة"
                copyText={String(client.pricePaid)}
              >
                <span dir="ltr" className="block text-start tabular-nums">
                  {client.pricePaid.toLocaleString("ar-EG")}
                </span>
              </FieldRow>
              <FieldRow
                label="المميزات والتعديلات"
                copyText={String(client.featuresModificationsPrice ?? 0)}
              >
                <span dir="ltr" className="block text-start tabular-nums">
                  {(client.featuresModificationsPrice ?? 0).toLocaleString(
                    "ar-EG",
                  )}
                </span>
              </FieldRow>
            </dl>
          </SectionCard>

          <SectionCard
            title="حسابات المشروع"
            icon={<FolderKanban className="h-4 w-4" aria-hidden />}
          >
            {!hasAnyProjectSection ? (
              <p className="text-sm leading-relaxed text-zinc-500">
                لا توجد بيانات مضافة في هذا القسم.
              </p>
            ) : (
              <div className="space-y-5">
                {pa.githubEnabled ? (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      حساب GitHub
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-xs text-zinc-500">
                            البريد الإلكتروني
                          </span>
                          <CopyIconButton text={pa.githubEmail || ""} />
                        </div>
                        <input
                          readOnly
                          value={pa.githubEmail || "—"}
                          dir="ltr"
                          className={`${readOnlyInput} text-left`}
                        />
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-xs text-zinc-500">
                            كلمة المرور
                          </span>
                          <CopyIconButton text={pa.githubPassword || ""} />
                        </div>
                        <input
                          readOnly
                          type="text"
                          value={pa.githubPassword || "—"}
                          dir="ltr"
                          className={`${readOnlyInput} font-mono text-left`}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                {pa.projectLinkEnabled ? (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-xs text-zinc-500">رابط المشروع</span>
                      {pa.projectLinkUrl.trim() !== "" ? (
                        <CopyIconButton text={pa.projectLinkUrl} />
                      ) : null}
                    </div>
                    <div className={valueBox}>
                      {pa.projectLinkUrl.trim() !== "" ? (
                        <a
                          href={pa.projectLinkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-cyan-400 hover:text-cyan-300"
                          dir="ltr"
                        >
                          {pa.projectLinkUrl}
                        </a>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="الاشتراكات"
            icon={<RefreshCw className="h-4 w-4" aria-hidden />}
          >
            {!sub.hasSubscriptions ? (
              <p className="text-sm leading-relaxed text-zinc-500">
                لا يوجد اشتراكات مسجّلة لهذا العميل.
              </p>
            ) : subscriptionRows.length === 0 ? (
              <p className="text-sm leading-relaxed text-zinc-500">
                تم تفعيل الاشتراكات دون إدخال تفاصيل بعد.
              </p>
            ) : (
              <ul className="space-y-4">
                {subscriptionRows.map((row, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 ring-1 ring-white/[0.02]"
                  >
                    <p className="mb-3 text-xs font-semibold text-zinc-400">
                      اشتراك {i + 1}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-xs text-zinc-500">
                            البريد الإلكتروني
                          </span>
                          <CopyIconButton text={row.email ?? ""} />
                        </div>
                        <input
                          readOnly
                          value={row.email ?? ""}
                          dir="ltr"
                          className={`${readOnlyInput} text-left`}
                        />
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-xs text-zinc-500">
                            كلمة المرور
                          </span>
                          <CopyIconButton text={row.password ?? ""} />
                        </div>
                        <input
                          readOnly
                          type="text"
                          value={row.password ?? ""}
                          dir="ltr"
                          className={`${readOnlyInput} font-mono text-left`}
                        />
                      </div>
                    </div>
                    {row.details.trim() !== "" ? (
                      <div className="mt-4 space-y-1.5">
                        <span className="text-xs text-zinc-500">
                          تفاصيل اختيارية
                        </span>
                        <p
                          className={`${valueBox} whitespace-pre-wrap`}
                          dir="rtl"
                        >
                          {row.details}
                        </p>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <div className="flex justify-end border-t border-zinc-800/80 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-600 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/45"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
