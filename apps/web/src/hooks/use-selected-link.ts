"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ShortUrlDto } from "@repo/shared";

export function useSelectedLink(links: ShortUrlDto[] | null) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkParam = searchParams?.get("link") ?? null;

  const selectedLink = useMemo(() => {
    if (!links || links.length === 0) return null;
    if (linkParam) {
      const found = links.find((l) => l.urlId === linkParam);
      if (found) return found;
    }
    return links[0] ?? null;
  }, [links, linkParam]);

  const selectLink = useCallback(
    (urlId: string) => {
      router.replace(`/?link=${encodeURIComponent(urlId)}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    if (!links || links.length === 0) return;
    if (!linkParam || !links.some((l) => l.urlId === linkParam)) {
      router.replace(`/?link=${encodeURIComponent(links[0].urlId)}`, {
        scroll: false,
      });
    }
  }, [links, linkParam, router]);

  return { selectedLink, selectLink, linkParam };
}

export type LinkSortOption =
  | "newest"
  | "oldest"
  | "most-clicks"
  | "fewest-clicks";

export function sortLinks(
  links: ShortUrlDto[],
  sort: LinkSortOption
): ShortUrlDto[] {
  const sorted = [...links];
  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    case "most-clicks":
      return sorted.sort((a, b) => b.clicks - a.clicks);
    case "fewest-clicks":
      return sorted.sort((a, b) => a.clicks - b.clicks);
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }
}

export function filterLinks(links: ShortUrlDto[], query: string): ShortUrlDto[] {
  const q = query.trim().toLowerCase();
  if (!q) return links;
  return links.filter(
    (l) =>
      l.origUrl.toLowerCase().includes(q) ||
      l.shortUrl.toLowerCase().includes(q) ||
      l.urlId.toLowerCase().includes(q)
  );
}
