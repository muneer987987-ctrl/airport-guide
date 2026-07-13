import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";

// Google's sitemap spec caps each file at 50,000 URLs. We chunk airports
// into pages of 40,000 to stay comfortably under that as the catalogue
// grows toward 10,000+ airports (each airport also contributes to country/
// city sitemaps, so we leave headroom).
const CHUNK_SIZE = 40_000;

export async function generateSitemaps() {
  const count = await db.airport.count({ where: { status: "PUBLISHED" } });
  const pages = Math.max(1, Math.ceil(count / CHUNK_SIZE));
  return Array.from({ length: pages }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  if (id === 0) {
    // First chunk also carries static, country, city, and feature pages.
    const [countries, cities, staticEntries] = await Promise.all([
      db.country.findMany({ select: { slug: true, updatedAt: true } }),
      db.city.findMany({ select: { slug: true, updatedAt: true } }),
      Promise.resolve([
        "", "search", "airport-parking", "airport-hotels", "airport-taxi",
        "airport-metro", "airport-lounges", "airport-maps", "airport-weather",
        "airport-transfers", "airport-flight-status", "airport-currency-exchange",
        "airport-faqs",
      ]),
    ]);

    const airports = await db.airport.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      take: CHUNK_SIZE,
      skip: id * CHUNK_SIZE,
    });

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

  const airports = await db.airport.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    take: CHUNK_SIZE,
    skip: id * CHUNK_SIZE,
  });

  return airports.map((a) => ({
    url: `${siteUrl}/airport/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));
}
