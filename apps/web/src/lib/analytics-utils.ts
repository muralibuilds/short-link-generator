import type { ClickEventDto } from "@repo/shared";

export interface DailyClickCount {
  date: string;
  count: number;
}

export interface DeviceBreakdown {
  mobile: number;
  desktop: number;
  tablet: number;
  other: number;
}

function toDayKey(value: string | Date): string {
  const d = new Date(value);
  return d.toISOString().slice(0, 10);
}

export function groupClicksByDay(clicks: ClickEventDto[]): DailyClickCount[] {
  const map = new Map<string, number>();
  for (const click of clicks) {
    const key = toDayKey(click.clickedAt);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTopCountry(clicks: ClickEventDto[]): string | null {
  const counts = new Map<string, number>();
  for (const click of clicks) {
    if (!click.country) continue;
    counts.set(click.country, (counts.get(click.country) ?? 0) + 1);
  }
  let top: string | null = null;
  let max = 0;
  for (const [country, count] of counts) {
    if (count > max) {
      max = count;
      top = country;
    }
  }
  return top;
}

export function getTopBrowser(clicks: ClickEventDto[]): string | null {
  const counts = new Map<string, number>();
  for (const click of clicks) {
    if (!click.browser) continue;
    counts.set(click.browser, (counts.get(click.browser) ?? 0) + 1);
  }
  let top: string | null = null;
  let max = 0;
  for (const [browser, count] of counts) {
    if (count > max) {
      max = count;
      top = browser;
    }
  }
  return top;
}

export function getDeviceBreakdown(clicks: ClickEventDto[]): DeviceBreakdown {
  const breakdown: DeviceBreakdown = {
    mobile: 0,
    desktop: 0,
    tablet: 0,
    other: 0,
  };
  for (const click of clicks) {
    const device = click.device?.toLowerCase() ?? "other";
    if (device === "mobile") breakdown.mobile += 1;
    else if (device === "tablet") breakdown.tablet += 1;
    else if (device === "desktop") breakdown.desktop += 1;
    else breakdown.other += 1;
  }
  return breakdown;
}

export function getDominantDevice(clicks: ClickEventDto[]): string | null {
  const b = getDeviceBreakdown(clicks);
  const entries = Object.entries(b).filter(([, v]) => v > 0);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}
