import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AirportCard } from "@/components/airport-card";
import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/utils";

export const revalidate = 3600;

const VALID_SLUGS = [
  "airport-parking",
  "airport-hotels",
  "airport-taxi",
  "airport-metro",
  "airport-lounges",
  "airport-maps",
  "airport-weather",
  "airport-transfers",
  "airport-flight-status",
  "airport-currency-exchange",
  "airport-faqs",
];

async function getLandingPage(slug: string) {
  if (!VALID_SLUGS.includes(slug)) return null;
  return db.landingPage.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ landing: string }>;
}): Promise<Metadata> {
  const { landing } = await params;
  const page = await getLandingPage(landing);
  if (!page) return {};
  const title = page.metaTitle ?? `${page.title} | ${siteName}`;
  const description = page.metaDescription ?? page.bodyContent.slice(0, 155);
  const url = `${siteUrl}/${landing}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName },
  };
}

export default async function LandingFeaturePage({
  params,
}: {
  params: Promise<{ landing: string }>;
}) {
  const { landing } = await params;
  const page = await getLandingPage(landing);
  if (!page) notFound();

  const airports = await db.airport.findMany({
    where: { status: "PUBLISHED" },
    include: { city: true, country: true },
    orderBy: { annualPassengers: "desc" },
    take: 12,
  });

  return (
    <div className="container-guide py-10">
      <p className="eyebrow mb-2">Feature guide</p>
      <h1 className="mb-4 font-display text-3xl font-700">{page.title}</h1>
      {page.heroSubtitle && <p className="mb-6 max-w-2xl text-ink-500">{page.heroSubtitle}</p>}
      <p className="mb-10 max-w-2xl text-ink-700 dark:text-ink-200">{page.bodyContent}</p>

      <h2 className="mb-5 font-display text-xl font-600">Jump to an airport</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {airports.map((a) => (
          <AirportCard key={a.slug} airport={a} />
        ))}
      </div>
    </div>
  );
}
