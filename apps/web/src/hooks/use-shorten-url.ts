"use client";

import { useCallback, useState } from "react";
import type { ShortUrlDto } from "@repo/shared";
import { createShortUrl } from "@/services/url.service";
import { ApiClientError } from "@/lib/api-client";

export function useShortenUrl() {
  const [result, setResult] = useState<ShortUrlDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shorten = useCallback(async (origUrl: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await createShortUrl(origUrl);
      setResult(data);
      return data;
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Failed to shorten URL";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { shorten, result, error, loading, reset };
}
