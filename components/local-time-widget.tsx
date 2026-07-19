"use client";

import { useEffect, useState } from "react";

export function LocalTimeWidget({ timezone, airportName }: { timezone: string; airportName: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <div className="card p-5">
        <p className="eyebrow mb-2">Local time</p>
        <p className="font-mono text-2xl font-600 text-ink-300">--:--:--</p>
      </div>
    );
  }

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <div className="card p-5">
      <p className="eyebrow mb-2">Local time at {airportName}</p>
      <p className="font-mono text-2xl font-600 text-ink-900 dark:text-white">{time}</p>
      <p className="text-sm text-ink-500">{date}</p>
    </div>
  );
}