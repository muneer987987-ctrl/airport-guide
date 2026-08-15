// @ts-nocheck
export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Metadata } from "next";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

async function getCity(slug: string) {
  try {
    return await db.city.findUnique({
      where: { slug },
      include: {
        country: true,
        airports: {
          include: { city: true, country: true },
          where: { status: "PUBLISHED" },
        },
      },
    });
  } catch (error) {
    console.error("City fetch error:", error);
    return null;
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCity(slug);

  if (!city) {
    return {
      title: "City Not Found",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `Airports in ${city.name}`,
    description: `Find all airports in ${city.name}, ${city.country?.name || ""}. Complete guide with terminals, lounges, hotels, and travel tips.`,
    robots: { index: false, follow: true },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await getCity(slug);

  if (!city) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Airports in {city.name}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {city.country?.name && `Country: ${city.country.name}`}
        </p>

        {city.airports && city.airports.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {city.airports.map((airport: any) => (
              <a
                key={airport.id}
                href={`/airport/${airport.slug}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {airport.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {airport.iataCode && `IATA: ${airport.iataCode}`}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No airports found for this city.</p>
        )}
      </div>
    </div>
  );
}
