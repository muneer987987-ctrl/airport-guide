import { db } from "@/lib/db";
import { AirportCard } from "@/components/airport-card";
import { GlobalSearch } from "@/components/global-search";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Airports",
  robots: { index: false, follow: true }, // search-result pages shouldn't compete with airport pages in the index
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const airports = query
    ? await db.airport.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { iata: { equals: query.toUpperCase() } },
            { icao: { equals: query.toUpperCase() } },
            { city: { name: { contains: query, mode: "insensitive" } } },
            { country: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: { city: true, country: true },
        take: 30,
      })
    : await db.airport.findMany({
        where: { status: "PUBLISHED" },
        include: { city: true, country: true },
        orderBy: { annualPassengers: "desc" },
        take: 30,
      });

  return (
    <div className="container-guide py-10">
      <h1 className="mb-6 font-display text-2xl font-600">
        {query ? `Results for "${query}"` : "All airports"}
      </h1>
      <div className="mb-8 max-w-xl">
        <GlobalSearch />
      </div>
      {airports.length === 0 ? (
        <p className="text-ink-500">
          No airports matched “{query}”. Try an IATA code like <code className="font-mono">LHR</code>,
          or a city name.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {airports.map((a) => (
            <AirportCard key={a.slug} airport={a} />
          ))}
        </div>
      )}
    </div>
  );
}
