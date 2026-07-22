import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Plane } from "lucide-react";

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
    <Link href={`/airport/${airport.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 hover:border-signal dark:hover:border-signal transition-all duration-500 hover:shadow-2xl hover:shadow-signal/10 hover:-translate-y-1">
        
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          {airport.heroImageUrl ? (
            <Image
              src={airport.heroImageUrl}
              alt={airport.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-ink-200 to-ink-300 dark:from-ink-700 dark:to-ink-600 flex items-center justify-center">
              <Plane className="w-16 h-16 text-ink-400 dark:text-ink-500" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* IATA Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/95 dark:bg-ink-900/95 backdrop-blur-sm rounded-lg font-mono font-bold text-sm text-ink-900 dark:text-white shadow-lg">
              {airport.iata}
            </span>
          </div>
          
          {/* Country Flag Placeholder */}
          <div className="absolute top-4 right-4">
            <span className="text-2xl">🏳️</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white group-hover:text-signal transition-colors duration-300">
            {airport.name}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-2 text-sm text-ink-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>{airport.city.name}, {airport.country.name}</span>
          </div>

          {/* Action */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-signal bg-signal/10 px-2.5 py-1 rounded-full">
              Guide Ready
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-ink-400 group-hover:text-signal transition-colors">
              Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}