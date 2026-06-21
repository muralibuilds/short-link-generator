"use client";

import { useCallback, useEffect, useState } from "react";
import type { ShortUrlDto } from "@repo/shared";
import { useAuth } from "@/context/auth-context";
import { listShortUrls } from "@/services/url.service";
import { ApiClientError } from "@/lib/api-client";

export function useDashboardLinks() {
  const { user, loading: authLoading } = useAuth();
  const [links, setLinks] = useState<ShortUrlDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const data = await listShortUrls();
      setLinks(data.items);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Failed to load links"
      );
      setLinks([]);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    listShortUrls()
      .then((data) => {
        if (!cancelled) setLinks(data.items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Failed to load links"
          );
          setLinks([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const addLink = useCallback((link: ShortUrlDto) => {
    setLinks((prev) => {
      if (!prev) return [link];
      const exists = prev.some((l) => l.urlId === link.urlId);
      if (exists) return prev;
      return [link, ...prev];
    });
  }, []);

  const loading = authLoading || (Boolean(user) && links === null && !error);

  return { links, loading, error, refresh, addLink };
}
