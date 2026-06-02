"use client";

import { useState } from "react";
import { shortenUrlSchema } from "@repo/shared";
import { useShortenUrl } from "@/hooks/use-shorten-url";

export function UrlShortenerForm() {
  const [origUrl, setOrigUrl] = useState("");
  const { shorten, result, error, loading, reset } = useShortenUrl();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = shortenUrlSchema.safeParse({ origUrl });
    if (!parsed.success) {
      return;
    }
    await shorten(parsed.data.origUrl);
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={origUrl}
          onChange={(e) => {
            setOrigUrl(e.target.value);
            reset();
          }}
          placeholder="https://example.com/long-url"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Short link</p>
          <a
            href={result.shortUrl}
            className="mt-1 block break-all font-medium text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            {result.shortUrl}
          </a>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Clicks: {result.clicks}
          </p>
        </div>
      )}
    </div>
  );
}
