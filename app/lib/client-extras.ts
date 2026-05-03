import type { Prisma } from "@prisma/client";

export type ProjectAccountsState = {
  githubEnabled: boolean;
  githubEmail: string;
  githubPassword: string;
  projectLinkEnabled: boolean;
  projectLinkUrl: string;
};

export type SubscriptionRow = {
  email: string;
  password: string;
  details: string;
};

export type SubscriptionsState = {
  hasSubscriptions: boolean;
  entries: SubscriptionRow[];
};

export const defaultProjectAccountsState = (): ProjectAccountsState => ({
  githubEnabled: false,
  githubEmail: "",
  githubPassword: "",
  projectLinkEnabled: false,
  projectLinkUrl: "",
});

export const defaultSubscriptionsState = (): SubscriptionsState => ({
  hasSubscriptions: false,
  entries: [{ email: "", password: "", details: "" }],
});

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** قيمة JSON من Prisma/الشبكة قد تصل ككائن أو كنص JSON (مثلاً بعد التسلسل) */
function coercePrismaJsonToObject(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  let v: unknown = raw;
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return null;
    try {
      v = JSON.parse(t) as unknown;
    } catch {
      return null;
    }
  }
  if (isRecord(v)) return v;
  return null;
}

export function parseProjectAccountsFromDb(raw: unknown): ProjectAccountsState {
  const d = defaultProjectAccountsState();
  const obj = coercePrismaJsonToObject(raw);
  if (!obj) return d;
  if (typeof obj.githubEnabled === "boolean") d.githubEnabled = obj.githubEnabled;
  if (typeof obj.githubEmail === "string") d.githubEmail = obj.githubEmail;
  if (typeof obj.githubPassword === "string") d.githubPassword = obj.githubPassword;
  if (typeof obj.projectLinkEnabled === "boolean") d.projectLinkEnabled = obj.projectLinkEnabled;
  if (typeof obj.projectLinkUrl === "string") d.projectLinkUrl = obj.projectLinkUrl;
  return d;
}

export function parseSubscriptionsFromDb(raw: unknown): SubscriptionsState {
  const d = defaultSubscriptionsState();
  const obj = coercePrismaJsonToObject(raw);
  if (!obj) return d;
  if (typeof obj.hasSubscriptions === "boolean") d.hasSubscriptions = obj.hasSubscriptions;
  const entries = obj.entries;
  if (Array.isArray(entries)) {
    const parsed: SubscriptionRow[] = [];
    for (const row of entries) {
      const rowObj = coercePrismaJsonToObject(row);
      if (!rowObj) continue;
      const legacyAccount =
        typeof rowObj.account === "string" ? rowObj.account : "";
      const email =
        typeof rowObj.email === "string"
          ? rowObj.email
          : legacyAccount;
      parsed.push({
        email,
        password: typeof rowObj.password === "string" ? rowObj.password : "",
        details: typeof rowObj.details === "string" ? rowObj.details : "",
      });
    }
    if (parsed.length > 0) d.entries = parsed;
  }
  return d;
}

export type ProjectAccountsPayload = {
  githubEnabled: boolean;
  githubEmail?: string;
  githubPassword?: string;
  projectLinkEnabled: boolean;
  projectLinkUrl?: string;
};

export type SubscriptionsPayload = {
  hasSubscriptions: boolean;
  entries: { email: string; password?: string; details?: string }[];
};

export function toProjectAccountsPayload(
  s: ProjectAccountsState,
): Prisma.InputJsonValue {
  const o: ProjectAccountsPayload = {
    githubEnabled: s.githubEnabled,
    projectLinkEnabled: s.projectLinkEnabled,
  };
  if (s.githubEnabled) {
    o.githubEmail = (s.githubEmail ?? "").trim() || undefined;
    o.githubPassword = (s.githubPassword ?? "") || undefined;
  }
  if (s.projectLinkEnabled) {
    o.projectLinkUrl = (s.projectLinkUrl ?? "").trim() || undefined;
  }
  return o as unknown as Prisma.InputJsonValue;
}

export function toSubscriptionsPayload(
  s: SubscriptionsState,
): Prisma.InputJsonValue {
  const entries = s.hasSubscriptions
    ? s.entries
        .map((e) => ({
          email: (e.email ?? "").trim(),
          password: (e.password ?? "") || undefined,
          details: (e.details ?? "").trim() || undefined,
        }))
        .filter(
          (e) =>
            e.email.length > 0 ||
            Boolean(e.password?.length) ||
            Boolean((e.details ?? "").trim().length),
        )
    : [];
  const o: SubscriptionsPayload = {
    hasSubscriptions: s.hasSubscriptions,
    entries,
  };
  return o as unknown as Prisma.InputJsonValue;
}

export function parseProjectAccountsFromBody(
  raw: unknown,
): ProjectAccountsState {
  if (!raw || !isRecord(raw)) return defaultProjectAccountsState();
  const d = defaultProjectAccountsState();
  if (typeof raw.githubEnabled === "boolean") d.githubEnabled = raw.githubEnabled;
  if (typeof raw.githubEmail === "string") d.githubEmail = raw.githubEmail.trim();
  if (typeof raw.githubPassword === "string") d.githubPassword = raw.githubPassword;
  if (typeof raw.projectLinkEnabled === "boolean") d.projectLinkEnabled = raw.projectLinkEnabled;
  if (typeof raw.projectLinkUrl === "string") d.projectLinkUrl = raw.projectLinkUrl.trim();
  return d;
}

export function parseSubscriptionsFromBody(raw: unknown): SubscriptionsState {
  if (!raw || !isRecord(raw)) return defaultSubscriptionsState();
  const d = defaultSubscriptionsState();
  if (typeof raw.hasSubscriptions === "boolean") d.hasSubscriptions = raw.hasSubscriptions;
  const entries = raw.entries;
  if (Array.isArray(entries)) {
    const parsed: SubscriptionRow[] = [];
    for (const row of entries) {
      if (!isRecord(row)) continue;
      const legacyAccount =
        typeof row.account === "string" ? row.account.trim() : "";
      const email =
        typeof row.email === "string" ? row.email.trim() : legacyAccount;
      parsed.push({
        email,
        password: typeof row.password === "string" ? row.password : "",
        details: typeof row.details === "string" ? row.details.trim() : "",
      });
    }
    if (parsed.length > 0) d.entries = parsed;
  }
  return d;
}
