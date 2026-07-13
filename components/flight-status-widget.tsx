import { getDepartures, getArrivals } from "@/lib/flights";

const STATUS_COLOR: Record<string, string> = {
  SCHEDULED: "text-ink-400",
  BOARDING: "text-signal",
  DEPARTED: "text-go",
  LANDED: "text-go",
  DELAYED: "text-stop",
  CANCELLED: "text-stop",
};

export async function FlightStatusWidget({ iata }: { iata: string }) {
  const [departures, arrivals] = await Promise.all([getDepartures(iata), getArrivals(iata)]);
  const hasData = departures.length > 0 || arrivals.length > 0;

  if (!hasData) {
    return (
      <div className="card p-5 text-sm text-ink-500">
        <p className="eyebrow mb-2">Live flight status</p>
        <p>
          Live arrivals and departures aren&apos;t connected yet for this deployment.
          Configure <code className="font-mono text-xs">FLIGHT_DATA_API_KEY</code> to enable
          real-time status here — see <code className="font-mono text-xs">lib/flights.ts</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <p className="eyebrow mb-3">Live departures</p>
      <div className="space-y-2 font-mono text-sm">
        {departures.slice(0, 8).map((f) => (
          <div key={f.flightNumber} className="flex justify-between border-b border-ink-100 pb-2 last:border-0 dark:border-ink-800">
            <span>{f.flightNumber}</span>
            <span className="text-ink-500">{f.destination}</span>
            <span className={STATUS_COLOR[f.status] ?? "text-ink-400"}>{f.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
