export function LinkDetailEmpty() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
        Select a link
      </p>
      <p className="mt-2 max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
        Choose a link from the list to view details, click stats, and analytics.
      </p>
    </div>
  );
}
