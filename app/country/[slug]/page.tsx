import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AirportCard } from "@/components/airport-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { countryMetadata, breadcrumbSchema, jsonLdScriptProps } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 3600;

async function getCountry(slug: string) {
  return db.country.findUnique({
    where: { slug },
    include: { airports: { include: { city: true, country: true }, where: { status: "PUBLISHED" } } },
  });
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountry(slug);
  if (!country) return {};
  return countryMetadata(country);
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = await getCountry(slug);
  if (!country) notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: country.name, path: `/country/${country.slug}` },
  ];

  return (
    <div className="container-guide py-10">
      <script {...jsonLdScriptProps([breadcrumbSchema(breadcrumbItems)])} />
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="mb-2 mt-6 font-display text-3xl font-700">
        Airports in {country.name} {country.flagEmoji}
      </h1>
      <p className="mb-8 text-ink-500">
        {country.airports.length} airport{country.airports.length === 1 ? "" : "s"} covered.
      </p>
      {country.airports.length === 0 ? (
        <p className="text-ink-500">Airport guides for {country.name} are coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {country.airports.map((a) => (
            <AirportCard key={a.slug} airport={a} />
          ))}
        </div>
      )}
    </div>
  );
}
