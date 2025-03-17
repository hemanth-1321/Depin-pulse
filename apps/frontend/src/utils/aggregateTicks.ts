import { Tick } from "@/hooks/useWebSites";

export interface AggregatedWindow {
  start: Date;
  end: Date;
  status: "up" | "down" | "unknown";
}

export function aggregateTicks(ticks: Tick[]): AggregatedWindow[] {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const interval = 3 * 60 * 1000; // 3-minute windows
  const windows: AggregatedWindow[] = [];

  for (let i = 0; i < 10; i++) {
    const start = new Date(thirtyMinutesAgo.getTime() + i * interval);
    const end = new Date(start.getTime() + interval);
    const windowTicks = ticks.filter(
      (tick) =>
        new Date(tick.createdAt) >= start && new Date(tick.createdAt) < end
    );

    const status =
      windowTicks.length === 0
        ? "unknown"
        : windowTicks.some((tick) => tick.status === "down")
          ? "down"
          : "up";

    windows.push({ start, end, status });
  }

  return windows;
}
