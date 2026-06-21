import { cn } from "@/lib/cn";

interface StatChipProps {
  label: string;
  value: string;
  className?: string;
}

export function StatChip({ label, value, className }: StatChipProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}
