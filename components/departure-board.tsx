const ROWS = [
  { code: "LHR", city: "LONDON", status: "GUIDE READY" },
  { code: "DXB", city: "DUBAI", status: "GUIDE READY" },
  { code: "JFK", city: "NEW YORK", status: "GUIDE READY" },
  { code: "SIN", city: "SINGAPORE", status: "GUIDE READY" },
  { code: "HND", city: "TOKYO", status: "GUIDE READY" },
];

/**
 * Decorative split-flap "departure board" — this is UI chrome, not a live
 * data feed. Real live flight status lives on each airport's own page,
 * sourced from lib/flights.ts.
 */
export function DepartureBoard() {
  return (
    <div className="w-full max-w-md border border-ink-700 bg-ink-900 font-mono text-signal shadow-2xl">
      <div className="flex items-center justify-between border-b border-ink-700 px-4 py-2 text-xs text-ink-400">
        <span>AIRPORT GUIDE INDEX</span>
        <span className="animate-pulse">●</span>
      </div>
      <div>
        {ROWS.map((row) => (
          <div
            key={row.code}
            className="flex items-center justify-between border-b border-ink-800 px-4 py-2.5 text-sm last:border-b-0"
          >
            <span className="w-12 font-500">{row.code}</span>
            <span className="flex-1 px-3 text-ink-200">{row.city}</span>
            <span className="text-xs text-go">{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
