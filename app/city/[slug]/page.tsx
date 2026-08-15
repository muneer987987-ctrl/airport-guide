export const dynamic = 'force-dynamic';
export const metadata = {
  title: "Airports in City Name",
  robots: {
    index: false,
    follow: true,
  },
};
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AirportCard } from "@/components/airport-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cityMetadata, breadcrumbSchema, jsonLdScriptProps } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 3600;

async function getCity(slug: string) {
  return db.city.findUnique({
    where: { slug },
    include: {
      country: true,
      airports: { include: { city: true, country: true }, where: { status: "PUBLISHED" } },
    },
  });
}

export async function generateStaticParams() {
  const cities = await db.city.findMany({ select: { slug: true } });
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCity(slug);
  if (!city) return {};
  return cityMetadata(city);
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = await getCity(slug);
  if (!city) notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: city.country.name, path: `/country/${city.country.slug}` },
    { name: city.name, path: `/city/${city.slug}` },
  ];

  return (
    <div className="container-guide py-10">
      <script {...jsonLdScriptProps([breadcrumbSchema(breadcrumbItems)])} />
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="mb-2 mt-6 font-display text-3xl font-700">
        Airports serving {city.name}, {city.country.name}
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {city.airports.map((a) => (
          <AirportCard key={a.slug} airport={a} />
        ))}
      </div>
    </div>
  );
}
