"use client";

import { useEffect, useState } from "react";
import type { ClickEventDto } from "@repo/shared";
import { listClickEvents } from "@/services/url.service";
import { ApiClientError } from "@/lib/api-client";

export function useClickAnalytics(urlId: string) {
  const [clicks, setClicks] = useState<ClickEventDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listClickEvents(urlId)
      .then((data) => {
        if (!cancelled) setClicks(data.items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Failed to load analytics"
          );
          setClicks([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [urlId]);

  const loading = clicks === null && !error;

  return { clicks, loading, error };
}
