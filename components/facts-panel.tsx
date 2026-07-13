import { formatMillions, formatNumber } from "@/lib/utils";

export function FactsPanel({
  iata,
  icao,
  city,
  country,
  timezone,
  runwayCount,
  terminalCount,
  elevationFt,
  openedYear,
  annualPassengers,
  annualPassengersYear,
}: {
  iata: string;
  icao: string;
  city: string;
  country: string;
  timezone: string;
  runwayCount: number | null;
  terminalCount: number | null;
  elevationFt: number | null;
  openedYear: number | null;
  annualPassengers: number | null;
  annualPassengersYear: number | null;
}) {
  const rows: [string, string][] = [
    ["IATA", iata],
    ["ICAO", icao],
    ["City", city],
    ["Country", country],
    ["Time zone", timezone],
    ["Terminals", terminalCount ? formatNumber(terminalCount) : "—"],
    ["Runways", runwayCount ? formatNumber(runwayCount) : "—"],
    ["Elevation", elevationFt ? `${formatNumber(elevationFt)} ft` : "—"],
    ["Opened", openedYear ? String(openedYear) : "—"],
    [
      "Annual passengers",
      annualPassengers
        ? `~${formatMillions(annualPassengers)}${annualPassengersYear ? ` (${annualPassengersYear})` : ""}`
        : "—",
    ],
  ];

  return (
    <div className="card p-5">
      <p className="eyebrow mb-4">Airport facts</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-ink-400">{label}</dt>
            <dd className="font-mono text-ink-800 dark:text-ink-100">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
