import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

interface AirportCardProps {
  airport: {
    slug: string;
    name: string;
    iata: string;
    city: { name: string };
    country: { name: string };
    heroImageUrl?: string | null;
  };
}

export function AirportCard({ airport }: AirportCardProps) {
  return (
    <Link href={`/airport/${airport.slug}`} className="group">
      <div className="card overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 bg-ink-200 dark:bg-ink-700">
          {airport.heroImageUrl ? (
            <Image
              src={airport.heroImageUrl}
              alt={airport.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-ink-400">
              <MapPin className="w-12 h-12" />
            </div>
          )}
          {/* IATA Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-ink-900/90 rounded-full">
            <span className="font-mono font-bold text-sm">{airport.iata}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-lg font-bold group-hover:text-signal transition">
            {airport.name}
          </h3>
          <p className="flex items-center gap-1 text-sm text-ink-500 mt-1">
            <MapPin className="w-3 h-3" />
            {airport.city.name}, {airport.country.name}
          </p>
          <div className="mt-4 flex items-center text-sm text-signal font-medium">
            View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>
    </Link>
  );
}