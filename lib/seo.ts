import type { Metadata } from "next";
import { siteUrl, siteName } from "./utils";
import type { Airport, City, Country, FAQ } from "@prisma/client";

type AirportWithRelations = Airport & {
  city: City;
  country: Country;
  faqs?: FAQ[];
};

// ----------------------------------------------------------------------------
// PAGE METADATA (unique per airport — never templated boilerplate)
// ----------------------------------------------------------------------------

export function airportMetadata(airport: AirportWithRelations): Metadata {
  const title =
    airport.metaTitle ??
    `${airport.name} (${airport.iata}) Guide — Terminals, Transfers & Tips | ${siteName}`;

  const description =
    airport.metaDescription ??
    `Everything you need for ${airport.name} (${airport.iata}/${airport.icao}) in ${airport.city.name}, ${airport.country.name}: terminal maps, lounges, parking, transfers, duty free, and live flight status.`;

  const path = airport.canonicalPath ?? `/airport/${airport.slug}`;
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "article",
      images: airport.heroImageUrl
        ? [{ url: airport.heroImageUrl, width: 1200, height: 630, alt: airport.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: airport.heroImageUrl ? [airport.heroImageUrl] : undefined,
    },
  };
}

export function cityMetadata(city: City & { country: Country }): Metadata {
  const title = city.metaTitle ?? `Airports in ${city.name}, ${city.country.name} | ${siteName}`;
  const description =
    city.metaDescription ??
    `Browse every airport serving ${city.name}, ${city.country.name}, with terminal guides, transfer options, and live flight info.`;
  const url = `${siteUrl}/city/${city.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function countryMetadata(country: Country): Metadata {
  const title = country.metaTitle ?? `Airports in ${country.name} | ${siteName}`;
  const description =
    country.metaDescription ??
    `Find every major airport in ${country.name}: terminal guides, ground transport, parking, and live arrivals & departures.`;
  const url = `${siteUrl}/country/${country.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ----------------------------------------------------------------------------
// JSON-LD SCHEMA.ORG BUILDERS
// ----------------------------------------------------------------------------

export function airportSchema(airport: AirportWithRelations) {
  return {
    "@context": "https://schema.org",
    "@type": "Airport",
    "@id": `${siteUrl}/airport/${airport.slug}#airport`,
    name: airport.name,
    iataCode: airport.iata,
    icaoCode: airport.icao,
    description: airport.descriptionShort ?? undefined,
    image: airport.heroImageUrl ?? undefined,
    url: `${siteUrl}/airport/${airport.slug}`,
    telephone: airport.phoneNumber ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: airport.city.name,
      addressCountry: airport.country.isoCode2,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: airport.latitude,
      longitude: airport.longitude,
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: FAQ[]): Record<string, unknown> | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  };
}

/** Renders a list of JSON-LD objects into a single <script> payload. */
export function jsonLdScriptProps(schemas: (Record<string, unknown> | null)[]) {
  const valid = schemas.filter(Boolean);
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(valid.length === 1 ? valid[0] : valid) },
  };
}
