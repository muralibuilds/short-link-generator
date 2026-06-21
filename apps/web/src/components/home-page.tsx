"use client";

import { useAuth } from "@/context/auth-context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { GuestLanding } from "@/components/guest/guest-landing";

export function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
        <DashboardShell />
      </div>
    );
  }

  return <GuestLanding />;
}
