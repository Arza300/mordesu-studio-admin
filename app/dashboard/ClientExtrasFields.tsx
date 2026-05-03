"use client";

import type {
  ProjectAccountsState,
  SubscriptionsState,
} from "@/app/lib/client-extras";

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-right text-white placeholder:text-zinc-500 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40";

type Props = {
  projectAccounts: ProjectAccountsState;
  setProjectAccounts: React.Dispatch<React.SetStateAction<ProjectAccountsState>>;
  subscriptions: SubscriptionsState;
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionsState>>;
};

export default function ClientExtrasFields({
  projectAccounts,
  setProjectAccounts,
  subscriptions,
  setSubscriptions,
}: Props) {
  return (
    <div className="space-y-6 border-t border-zinc-800 pt-4">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">حسابات المشروع</h3>
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={Boolean(projectAccounts.githubEnabled)}
              onChange={(e) =>
                setProjectAccounts((p) => ({ ...p, githubEnabled: e.target.checked }))
              }
              className="rounded border-zinc-600 bg-zinc-800 text-cyan-600 focus:ring-cyan-500/40"
            />
            حساب GitHub
          </label>
          {projectAccounts.githubEnabled && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <span className="block text-sm font-medium text-zinc-300">البريد الإلكتروني</span>
                <input
                  type="email"
                  autoComplete="off"
                  value={projectAccounts.githubEmail ?? ""}
                  onChange={(e) =>
                    setProjectAccounts((p) => ({ ...p, githubEmail: e.target.value }))
                  }
                  dir="ltr"
                  className={`${inputClass} text-left`}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <span className="block text-sm font-medium text-zinc-300">كلمة المرور</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={projectAccounts.githubPassword ?? ""}
                  onChange={(e) =>
                    setProjectAccounts((p) => ({ ...p, githubPassword: e.target.value }))
                  }
                  dir="ltr"
                  className={`${inputClass} text-left`}
                />
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={Boolean(projectAccounts.projectLinkEnabled)}
              onChange={(e) =>
                setProjectAccounts((p) => ({ ...p, projectLinkEnabled: e.target.checked }))
              }
              className="rounded border-zinc-600 bg-zinc-800 text-cyan-600 focus:ring-cyan-500/40"
            />
            رابط المشروع
          </label>
          {projectAccounts.projectLinkEnabled && (
            <div className="space-y-1.5">
              <span className="block text-sm font-medium text-zinc-300">رابط المشروع</span>
              <input
                type="url"
                value={projectAccounts.projectLinkUrl ?? ""}
                onChange={(e) =>
                  setProjectAccounts((p) => ({ ...p, projectLinkUrl: e.target.value }))
                }
                dir="ltr"
                className={`${inputClass} text-left`}
                placeholder="https://..."
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">الاشتراكات</h3>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={Boolean(subscriptions.hasSubscriptions)}
            onChange={(e) =>
              setSubscriptions((s) => ({
                ...s,
                hasSubscriptions: e.target.checked,
              }))
            }
            className="mt-1 rounded border-zinc-600 bg-zinc-800 text-cyan-600 focus:ring-cyan-500/40"
          />
          <span className="leading-relaxed">
            هل هذا العميل لديه اشتراكات (دومين، هوست، مساحة تخزين)؟
          </span>
        </label>

        {subscriptions.hasSubscriptions && (
          <div className="mt-4 space-y-4">
            {subscriptions.entries.map((row, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-700/80 bg-zinc-800/40 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-zinc-400">
                    حساب اشتراك {index + 1}
                  </span>
                  {subscriptions.entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSubscriptions((s) => ({
                          ...s,
                          entries: s.entries.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      حذف الصف
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-zinc-300">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      autoComplete="off"
                      value={row.email ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSubscriptions((s) => ({
                          ...s,
                          entries: s.entries.map((entry, i) =>
                            i === index ? { ...entry, email: v } : entry,
                          ),
                        }));
                      }}
                      dir="ltr"
                      className={`${inputClass} text-left`}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-zinc-300">
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={row.password ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSubscriptions((s) => ({
                          ...s,
                          entries: s.entries.map((entry, i) =>
                            i === index ? { ...entry, password: v } : entry,
                          ),
                        }));
                      }}
                      dir="ltr"
                      className={`${inputClass} text-left`}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-300">
                    تفاصيل عن هذا الاشتراك{" "}
                    <span className="font-normal text-zinc-500">(اختياري)</span>
                  </label>
                  <textarea
                    value={row.details ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSubscriptions((s) => ({
                        ...s,
                        entries: s.entries.map((entry, i) =>
                          i === index ? { ...entry, details: v } : entry,
                        ),
                      }));
                    }}
                    rows={2}
                    dir="rtl"
                    className={inputClass}
                    placeholder="ملاحظات إضافية…"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setSubscriptions((s) => ({
                  ...s,
                  entries: [...s.entries, { email: "", password: "", details: "" }],
                }))
              }
              className="rounded-lg border border-zinc-600 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
            >
              + إضافة حساب اشتراك
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
