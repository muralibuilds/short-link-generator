"use client";

import { useRef, useState } from "react";
import { shortenUrlSchema } from "@repo/shared";
import type { ShortUrlDto } from "@repo/shared";
import { useShortenUrl } from "@/hooks/use-shorten-url";
import { useToast } from "@/components/ui/toast";

interface CreateLinkBarProps {
  onCreated: (link: ShortUrlDto) => void;
}

export function CreateLinkBar({ onCreated }: CreateLinkBarProps) {
  const [origUrl, setOrigUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { shorten, loading, error, reset } = useShortenUrl();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = shortenUrlSchema.safeParse({ origUrl });
    if (!parsed.success) return;

    try {
      const link = await shorten(parsed.data.origUrl);
      onCreated(link);
      setOrigUrl("");
      reset();
      toast("Short link created");
    } catch {
      toast("Failed to create link");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          type="url"
          value={origUrl}
          onChange={(e) => {
            setOrigUrl(e.target.value);
            reset();
          }}
          placeholder="Paste a long URL to shorten…"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? "Creating…" : "Shorten"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export function focusCreateLinkInput() {
  document.querySelector<HTMLInputElement>('input[type="url"]')?.focus();
}
