"use client";

import { useState } from "react";
import LoadingOverlay from "@/app/components/LoadingOverlay";

type Props = { label?: string; loadingLabel?: string; className?: string };

export default function LogoutButton({
  label = "خروج",
  loadingLabel = "جاري الخروج...",
  className = "rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white disabled:opacity-60",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } finally {
      setLoading(false);
      window.location.href = "/";
    }
  }

  return (
    <>
      {loading && <LoadingOverlay message={loadingLabel} />}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={className}
      >
        {label}
      </button>
    </>
  );
}
