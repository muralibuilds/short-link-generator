"use client";

import type { ShortUrlDto } from "@repo/shared";
import { formatDate, formatRelativeDate } from "@/lib/format";
import { CopyButton } from "@/components/ui/copy-button";
import { DetailPanelSkeleton } from "@/components/ui/skeleton";
import { AnalyticsSummary } from "./analytics-summary";
import { ClicksOverTimeChart } from "./clicks-over-time-chart";
import { ClickAnalyticsTable } from "@/components/click-analytics-table";
import { useClickAnalytics } from "@/hooks/use-click-analytics";

interface LinkDetailPanelProps {
  link: ShortUrlDto;
}

export function LinkDetailPanel({ link }: LinkDetailPanelProps) {
  const { clicks, loading, error } = useClickAnalytics(link.urlId);

  if (loading) {
    return <DetailPanelSkeleton />;
  }

  const clickList = clicks ?? [];

  return (
    <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Short link
          </p>
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all font-mono text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {link.shortUrl}
          </a>
        </div>
        <div className="flex shrink-0 gap-2">
          <CopyButton value={link.shortUrl} />
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Open
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Created
          </p>
          <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
            {formatDate(link.date)}
          </p>
          <p className="text-xs text-zinc-500">{formatRelativeDate(link.date)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Original URL
          </p>
          <a
            href={link.origUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {link.origUrl}
          </a>
        </div>
      </div>

      <div>
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {link.clicks}
        </p>
        <p className="text-sm text-zinc-500">Total clicks</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {clickList.length > 0 ? (
        <>
          <AnalyticsSummary clicks={clickList} totalClicks={link.clicks} />
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Clicks over time
            </h3>
            <ClicksOverTimeChart clicks={clickList} />
          </div>
        </>
      ) : (
        !error && (
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No clicks recorded yet. Share your link to start tracking.
            </p>
            <div className="mt-4 flex justify-center">
              <CopyButton value={link.shortUrl} label="Copy link" />
            </div>
          </div>
        )
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Click log
        </h3>
        <ClickAnalyticsTable clicks={clickList} />
      </div>
    </div>
  );
}
