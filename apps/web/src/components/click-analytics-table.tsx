"use client";

import type { ClickEventDto } from "@repo/shared";
import { formatDate } from "@/lib/format";

interface ClickAnalyticsTableProps {
  clicks: ClickEventDto[];
  loading?: boolean;
}

export function ClickAnalyticsTable({
  clicks,
  loading,
}: ClickAnalyticsTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (clicks.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No click events to display.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
              Timestamp
            </th>
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
              IP
            </th>
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
              Country
            </th>
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
              Referrer
            </th>
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
              Device
            </th>
            <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-400">
              Browser
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {clicks.map((click) => (
            <tr
              key={click._id ?? `${click.urlId}-${String(click.clickedAt)}`}
              className="bg-white dark:bg-zinc-950"
            >
              <td className="whitespace-nowrap px-4 py-3">
                {formatDate(click.clickedAt)}
              </td>
              <td className="px-4 py-3">{click.ip}</td>
              <td className="px-4 py-3">{click.country ?? "—"}</td>
              <td
                className="max-w-xs truncate px-4 py-3"
                title={click.referrer ?? undefined}
              >
                {click.referrer ?? "—"}
              </td>
              <td className="px-4 py-3">{click.device ?? "—"}</td>
              <td className="px-4 py-3">{click.browser ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
