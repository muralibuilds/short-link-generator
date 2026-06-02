"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-black">
        <div className="max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Application error
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {error.message}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
