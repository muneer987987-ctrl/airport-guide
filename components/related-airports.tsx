"use server";

import { db } from "@/lib/db";
import Link from "next/link";

interface RelatedAirportsProps {
  currentAirportId: string;
  countryId: string;
  cityId?: string;
}

export default async function RelatedAirports({
  currentAirportId,
  countryId,
  cityId,
}: RelatedAirportsProps) {
  // Fetch 3 related airports from same country (excluding current)
  const relatedAirports = await db.airport.findMany({
    where: {
      countryId: countryId,
      id: { not: currentAirportId },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      iataCode: true,
      city: { select: { name: true } },
      country: { select: { name: true } },
    },
    take: 3,
    orderBy: { annualPassengers: "desc" }, // Most popular first
  });

  // If less than 3 from same country, fetch from nearby countries
  if (relatedAirports.length < 3) {
    const additional = await db.airport.findMany({
      where: {
        id: { not: currentAirportId },
        countryId: { not: countryId },
        status: "PUBLISHED",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        iataCode: true,
        city: { select: { name: true } },
        country: { select: { name: true } },
      },
      take: 3 - relatedAirports.length,
      orderBy: { annualPassengers: "desc" },
    });
    relatedAirports.push(...additional);
  }

  if (relatedAirports.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-600">Related Airport Guides</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relatedAirports.map((airport) => (
          <Link
            key={airport.id}
            href={`/airport/${airport.slug}`}
            className="card p-4 hover:border-signal transition-colors group"
          >
            <p className="font-display font-600 group-hover:text-signal transition-colors">
              {airport.name} ({airport.iataCode})
            </p>
            <p className="text-xs text-ink-400 mt-1">
              {airport.city.name}, {airport.country.name}
            </p>
            <p className="text-xs text-signal-dim mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              View guide →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}