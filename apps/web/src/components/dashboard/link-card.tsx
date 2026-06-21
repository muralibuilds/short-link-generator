"use client";

import type { ShortUrlDto } from "@repo/shared";
import { formatRelativeDate, truncateUrl } from "@/lib/format";
import { cn } from "@/lib/cn";

interface LinkCardProps {
  link: ShortUrlDto;
  selected: boolean;
  onSelect: () => void;
}

export function LinkCard({ link, selected, onSelect }: LinkCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition",
        selected
          ? "border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-900 dark:ring-zinc-100"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
      )}
    >
      <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
        {truncateUrl(link.origUrl, 42)}
      </p>
      <p className="mt-1 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
        /{link.urlId}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {link.clicks} click{link.clicks === 1 ? "" : "s"}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatRelativeDate(link.date)}
        </span>
      </div>
    </button>
  );
}
