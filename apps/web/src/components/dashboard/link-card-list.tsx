"use client";

import { useState } from "react";
import type { ShortUrlDto } from "@repo/shared";
import { LinkCard } from "./link-card";
import { LinkCardSkeleton } from "@/components/ui/skeleton";
import {
  filterLinks,
  sortLinks,
  type LinkSortOption,
} from "@/hooks/use-selected-link";

interface LinkCardListProps {
  links: ShortUrlDto[];
  selectedUrlId: string | null;
  onSelect: (urlId: string) => void;
  loading?: boolean;
}

export function LinkCardList({
  links,
  selectedUrlId,
  onSelect,
  loading,
}: LinkCardListProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<LinkSortOption>("newest");

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <LinkCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const filtered = filterLinks(links, search);
  const sorted = sortLinks(filtered, sort);

  return (
    <div className="flex h-full flex-col gap-3">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search links…"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as LinkSortOption)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="most-clicks">Most clicks</option>
        <option value="fewest-clicks">Fewest clicks</option>
      </select>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No links match your search.
          </p>
        ) : (
          sorted.map((link) => (
            <LinkCard
              key={link.urlId}
              link={link}
              selected={selectedUrlId === link.urlId}
              onSelect={() => onSelect(link.urlId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
