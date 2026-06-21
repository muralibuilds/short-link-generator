"use client";

import type { ClickEventDto } from "@repo/shared";
import {
  getDominantDevice,
  getTopBrowser,
  getTopCountry,
} from "@/lib/analytics-utils";
import { StatChip } from "@/components/ui/stat-chip";

interface AnalyticsSummaryProps {
  clicks: ClickEventDto[];
  totalClicks: number;
}

export function AnalyticsSummary({ clicks, totalClicks }: AnalyticsSummaryProps) {
  const topCountry = getTopCountry(clicks) ?? "—";
  const topBrowser = getTopBrowser(clicks) ?? "—";
  const topDevice = getDominantDevice(clicks) ?? "—";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatChip label="Total clicks" value={String(totalClicks)} />
      <StatChip label="Top country" value={topCountry} />
      <StatChip label="Top browser" value={topBrowser} />
      <StatChip label="Top device" value={topDevice} />
    </div>
  );
}
