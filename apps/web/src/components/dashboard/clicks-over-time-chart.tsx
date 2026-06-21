"use client";

import dynamic from "next/dynamic";
import type { ClickEventDto } from "@repo/shared";

const ClicksOverTimeChartInner = dynamic(
  () =>
    import("./clicks-over-time-chart-inner").then(
      (m) => m.ClicksOverTimeChartInner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700">
        Loading chart…
      </div>
    ),
  }
);

interface ClicksOverTimeChartProps {
  clicks: ClickEventDto[];
}

export function ClicksOverTimeChart({ clicks }: ClicksOverTimeChartProps) {
  return <ClicksOverTimeChartInner clicks={clicks} />;
}
