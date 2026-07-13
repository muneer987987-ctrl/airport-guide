import { db } from "@/lib/db";
import { GlobalSearch } from "@/components/global-search";
import { AirportCard } from "@/components/airport-card";
import { DepartureBoard } from "@/components/departure-board";
import Link from "next/link";

export const revalidate = 3600; // ISR: refresh hourly

export default async function HomePage() {
  const [airports, airportCount, countryCount] = await Promise.all([
    db.airport.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { annualPassengers: "desc" },
      take: 9,
      include: { city: true, country: true },
    }),
    db.airport.count({ where: { status: "PUBLISHED" } }),
    db.country.count(),
  ]);

  return (
    <>
      <section className="border-b border-ink-200 bg-ink-950 text-white dark:border-ink-800">
        <div className="container-guide flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:py-24">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Now boarding</p>
            <h1 className="font-display text-4xl font-700 leading-[1.05] sm:text-5xl">
              The airport guide for wherever your gate is.
            </h1>
            <p className="mt-5 text-ink-300">
              Terminal maps, lounges, parking, transfers, and live flight status —
              built for {airportCount}+ airports and growing toward every airport on earth.
            </p>
            <div className="mt-8">
              <GlobalSearch />
            </div>
            <p className="mt-3 font-mono text-xs text-ink-400">
              Try “LHR”, “Dubai”, or “Tokyo Haneda”
            </p>
          </div>
          <DepartureBoard />
        </div>
      </section>

      <section className="container-guide py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2">Busiest hubs</p>
            <h2 className="font-display text-2xl font-600">Popular airports</h2>
          </div>
          <Link href="/search" className="font-mono text-sm text-beacon">
            Browse all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {airports.map((a) => (
            <AirportCard key={a.slug} airport={a} />
          ))}
        </div>
      </section>

      <section className="border-t border-ink-200 bg-ink-50 py-14 dark:border-ink-800 dark:bg-ink-900">
        <div className="container-guide grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          <Stat label="Airports covered" value={String(airportCount)} />
          <Stat label="Countries" value={String(countryCount)} />
          <Stat label="Guide sections per airport" value="40+" />
          <Stat label="Built for scale" value="10,000+" />
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-3xl font-500 text-signal-dim dark:text-signal">{value}</div>
      <div className="mt-1 text-sm text-ink-500 dark:text-ink-400">{label}</div>
    </div>
  );
}
