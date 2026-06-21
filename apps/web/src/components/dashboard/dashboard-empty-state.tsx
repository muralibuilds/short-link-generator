"use client";

interface DashboardEmptyStateProps {
  onCreateClick?: () => void;
}

export function DashboardEmptyState({ onCreateClick }: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
      <svg
        className="mb-6 h-16 w-16 text-zinc-300 dark:text-zinc-600"
        fill="none"
        viewBox="0 0 64 64"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M28 36h8M20 20h24a4 4 0 014 4v20a4 4 0 01-4 4H20a4 4 0 01-4-4V24a4 4 0 014-4z"
        />
        <path strokeLinecap="round" d="M24 28h16M24 34h10" />
      </svg>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        No short links yet
      </h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        Create your first trackable link using the bar above. Every click will
        be recorded with location, device, and referrer data.
      </p>
      {onCreateClick && (
        <button
          type="button"
          onClick={onCreateClick}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Create your first link
        </button>
      )}
    </div>
  );
}
