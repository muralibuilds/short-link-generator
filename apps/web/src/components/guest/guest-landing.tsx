import { Suspense } from "react";
import { UrlShortenerForm } from "@/components/url-shortener-form";

export function GuestLanding() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <main className="flex w-full max-w-3xl flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Short links with analytics
          </h1>
          <p className="mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
            Shorten URLs, track every click with geo and device data, and manage
            all your links from one dashboard.
          </p>
        </div>
        {/* <ul className="grid w-full max-w-md gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-3">
          <li className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
            Click tracking
          </li>
          <li className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
            Geo & device
          </li>
          <li className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
            Your dashboard
          </li>
        </ul> */}
        <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
          <UrlShortenerForm />
        </Suspense>
      </main>
    </div>
  );
}
