import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";

/**
 * Simple single-file sitemap — fine up to ~40,000 URLs (Google's per-file
 * cap is 50,000). Once the catalogue approaches that size, split this back
 * into a chunked sitemap index using generateSitemaps().
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countries, cities, airports] = await Promise.all([
    db.country.findMany({ select: { slug: true, updatedAt: true } }),
    db.city.findMany({ select: { slug: true, updatedAt: true } }),
    db.airport.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticEntries = [
    "", "search", "airport-parking", "airport-hotels", "airport-taxi",
    "airport-metro", "airport-lounges", "airport-maps", "airport-weather",
    "airport-transfers", "airport-flight-status", "airport-currency-exchange",
    "airport-faqs",
  ];

  return [
    ...staticEntries.map((path) => ({
      url: `${siteUrl}/${path}`,
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...countries.map((c) => ({
      url: `${siteUrl}/country/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...cities.map((c) => ({
      url: `${siteUrl}/city/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...airports.map((a) => ({
      url: `${siteUrl}/airport/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}