import Link from "next/link";
import Image from "next/image";
import { formatMillions } from "@/lib/utils";

export type AirportCardData = {
  slug: string;
  name: string;
  iata: string;
  icao: string;
  heroImageUrl: string | null;
  descriptionShort: string | null;
  annualPassengers: number | null;
  city: { name: string };
  country: { name: string; flagEmoji: string | null };
};

export function AirportCard({ airport }: { airport: AirportCardData }) {
  return (
    <Link
      href={`/airport/${airport.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative h-40 w-full bg-ink-100 dark:bg-ink-800">
        {airport.heroImageUrl ? (
          <Image
            src={airport.heroImageUrl}
            alt={airport.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-3xl text-ink-300 dark:text-ink-600">
            {airport.iata}
          </div>
        )}
        <div className="absolute left-2 top-2 bg-ink-950/80 px-2 py-1 font-mono text-xs text-white">
          {airport.iata} · {airport.icao}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-600 leading-tight">{airport.name}</h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          {airport.city.name}, {airport.country.name}
        </p>
        {airport.annualPassengers && (
          <p className="mt-2 font-mono text-xs text-ink-400">
            {formatMillions(airport.annualPassengers)} passengers/yr
          </p>
        )}
      </div>
    </Link>
  );
}
