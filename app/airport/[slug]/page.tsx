// @ts-nocheck
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import {
  airportMetadata,
  airportSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLdScriptProps,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FactsPanel } from "@/components/facts-panel";
import { TerminalGuide } from "@/components/terminal-guide";
import { AmenityGrid } from "@/components/amenity-grid";
import { FlightStatusWidget } from "@/components/flight-status-widget";
import { WeatherWidget } from "@/components/weather-widget";
import { FaqAccordion } from "@/components/faq-accordion";
import { GuideSection } from "@/components/guide-section";
import { AffiliateBlock } from "@/components/affiliate-block";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";
import RelatedAirports from "@/components/related-airports";
import { CurrencyConverter } from "@/components/currency-converter";
import { LocalTimeWidget } from "@/components/local-time-widget";
import type { Metadata } from "next";

export const revalidate = 3600;

// FAST: Basic airport only (no includes)
async function getAirportBasic(slug: string) {
  return db.airport.findUnique({
    where: { slug },
  }) as any;
}

// FAST: City & Country only
async function getCityCountry(cityId: string, countryId: string) {
  const [city, country] = await Promise.all([
    db.city.findUnique({ where: { id: cityId } }).catch(() => null),
    db.country.findUnique({ where: { id: countryId } }).catch(() => null),
  ]);
  return { city, country };
}

// FAST: Related data in parallel
async function getAirportRelated(airportId: string) {
  const [
    images, terminals, amenities, lounges, hotels,
    transferOptions, parkingOptions, faqs, tips,
    emergencyContacts, transitVisaInfo, layoverGuide,
    accessibility, petTravelInfo, customsInfo, baggageRules, securityRules,
  ] = await Promise.all([
    db.airportImage.findMany({ where: { airportId }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    db.terminal.findMany({ where: { airportId }, include: { airlines: { include: { airline: true } } } }).catch(() => []),
    db.amenity.findMany({ where: { airportId } }).catch(() => []),
    db.lounge.findMany({ where: { airportId } }).catch(() => []),
    db.nearbyHotel.findMany({ where: { airportId } }).catch(() => []),
    db.transferOption.findMany({ where: { airportId } }).catch(() => []),
    db.parkingOption.findMany({ where: { airportId } }).catch(() => []),
    db.fAQ.findMany({ where: { airportId }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    db.airportTip.findMany({ where: { airportId }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    db.emergencyContact.findMany({ where: { airportId } }).catch(() => []),
    db.transitVisaInfo.findMany({ where: { airportId } }).catch(() => []),
    db.layoverGuide.findMany({ where: { airportId } }).catch(() => []),
    db.accessibility.findMany({ where: { airportId } }).catch(() => []),
    db.petTravelInfo.findMany({ where: { airportId } }).catch(() => []),
    db.customsInfo.findMany({ where: { airportId } }).catch(() => []),
    db.baggageRule.findMany({ where: { airportId } }).catch(() => []),
    db.securityRule.findMany({ where: { airportId } }).catch(() => []),
  ]);

  return {
    images, terminals, amenities, lounges, hotels,
    transferOptions, parkingOptions, faqs, tips,
    emergencyContacts, transitVisaInfo, layoverGuide,
    accessibility, petTravelInfo, customsInfo, baggageRules, securityRules,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const airport = await getAirportBasic(slug);
  if (!airport) return {};
  return airportMetadata(airport);
}

export default async function AirportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Step 1: Basic airport
  const airport = await getAirportBasic(slug);
  if (!airport || airport.status !== "PUBLISHED") notFound();

  // Step 2: City & Country
  const { city, country } = await getCityCountry(airport.cityId, airport.countryId);

  // Step 3: All related data (parallel)
  const related = await getAirportRelated(airport.id);

  // Merge into airport object for original component compatibility
  const fullAirport = {
    ...airport,
    city,
    country,
    ...related,
  };

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: country?.name || "", path: `/country/${country?.slug || ""}` },
    { name: city?.name || "", path: `/city/${city?.slug || ""}` },
    { name: airport.iata || airport.iataCode || "", path: `/airport/${airport.slug}` },
  ];

  return (
    <>
      <script
        {...jsonLdScriptProps([
          airportSchema(fullAirport),
          breadcrumbSchema(breadcrumbItems),
          faqSchema(fullAirport.faqs),
        ])}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container-guide py-3">
        <ShareButtons url={`https://airport-guide-seven.vercel.app/airport/${airport.slug}`} title={airport.name} />
      </div>

      <header className="relative h-[320px] w-full bg-ink-900 sm:h-[420px]">
        {airport.heroImageUrl && (
          <Image
            src={airport.heroImageUrl}
            alt={airport.name}
            fill
            priority
            className="object-cover opacity-70"
          />
        )}
        <div className="container-guide absolute inset-x-0 bottom-0 pb-8 text-white">
          <p className="eyebrow mb-2 text-signal">
            {city?.name || ""}, {country?.name || ""}
          </p>
          <h1 className="font-display text-3xl font-700 sm:text-4xl">{airport.name}</h1>
          <p className="mt-2 font-mono text-sm text-ink-200">
            {airport.iata || airport.iataCode || ""} / {airport.icao || ""}
          </p>
        </div>
      </header>

      <div className="container-guide grid grid-cols-1 gap-10 py-10 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0">
          <GuideSection id="overview" title="Overview">
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: airport.overview || "" }} 
            />
            {airport.history && (
              <>
                <h3 className="mb-2 mt-6 font-display text-base font-600">History</h3>
                <div 
                  className="prose prose-lg max-w-none text-ink-700 dark:text-ink-200" 
                  dangerouslySetInnerHTML={{ __html: airport.history }} 
                />
              </>
            )}
          </GuideSection>

          <AffiliateBlock
            networks={["TRAVELPAYOUTS"]}
            iata={airport.iata || airport.iataCode || ""}
            city={city?.name || ""}
            heading="Book flights to this airport"
          />

          <GuideSection id="terminals" title="Terminal Guide">
            <TerminalGuide terminals={fullAirport.terminals} />
          </GuideSection>

          <GuideSection id="amenities" title="Amenities & Services">
            <AmenityGrid amenities={fullAirport.amenities} />
          </GuideSection>

          <AffiliateBlock
            networks={["AIRALO", "SAFETYWING", "VISITORS_COVERAGE"]}
            iata={airport.iata || airport.iataCode || ""}
            city={city?.name || ""}
            heading="Before you fly"
          />

          <GuideSection id="lounges" title="Lounges">
            {fullAirport.lounges.length === 0 ? (
              <p className="text-sm text-ink-500">Lounge listings for this airport are coming soon.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fullAirport.lounges.map((l: any) => (
                  <div key={l.id} className="card p-4">
                    <h3 className="font-display font-600">{l.name}</h3>
                    {l.terminal && <p className="text-xs text-ink-400">{l.terminal}</p>}
                    {l.accessRules && <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{l.accessRules}</p>}
                  </div>
                ))}
              </div>
            )}
          </GuideSection>

          <GuideSection id="transfers" title="Transfers, Taxi & Public Transport">
            <ul className="space-y-3">
              {fullAirport.transferOptions.map((t: any) => (
                <li key={t.id} className="card p-4 text-sm">
                  <span className="font-mono text-xs uppercase tracking-wide text-signal-dim dark:text-signal">
                    {t.type?.replace("_", " ") || ""}
                  </span>
                  <p className="mt-1 text-ink-700 dark:text-ink-200">{t.description}</p>
                </li>
              ))}
            </ul>
            <AffiliateBlock
              networks={["JAYRIDE", "KIWITAXI", "HOLIDAY_TAXIS", "WELCOME_PICKUPS", "DISCOVER_CARS"]}
              iata={airport.iata || airport.iataCode || ""}
              city={city?.name || ""}
              heading="Book ground transport"
            />
          </GuideSection>

          <GuideSection id="parking" title="Parking">
            <ul className="space-y-3">
              {fullAirport.parkingOptions.map((p: any) => (
                <li key={p.id} className="card p-4 text-sm">
                  <span className="font-mono text-xs uppercase tracking-wide text-signal-dim dark:text-signal">
                    {p.type?.replace("_", " ") || ""}
                  </span>
                  <p className="mt-1 font-medium text-ink-800 dark:text-ink-100">{p.name}</p>
                </li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection id="hotels" title="Nearby Hotels">
            {fullAirport.hotels.length === 0 ? (
              <p className="text-sm text-ink-500">Hotel listings for this airport are coming soon.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fullAirport.hotels.map((h: any) => (
                  <div key={h.id} className="card p-4 text-sm">
                    <p className="font-display font-600">{h.name}</p>
                    {h.distanceKm && <p className="text-ink-400">{h.distanceKm} km from terminal</p>}
                  </div>
                ))}
              </div>
            )}
            <AffiliateBlock networks={["BOOKING_COM"]} city={city?.name || ""} heading="Find a room nearby" />
          </GuideSection>

          <GuideSection id="layover" title="Layover & Transit Guide">
            <p className="text-sm text-ink-600 dark:text-ink-300">
              {fullAirport.layoverGuide?.[0]?.content ??
                "Detailed layover guidance for this airport is being prepared. As a general rule, check your connection time against the airline's official minimum connection time for this airport before booking a tight transfer."}
            </p>
          </GuideSection>

          <GuideSection id="rules" title="Baggage, Security & Customs">
            <div className="space-y-4 text-sm text-ink-600 dark:text-ink-300">
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Security: </span>
                {fullAirport.securityRules?.[0]?.content ?? "Follow standard international carry-on liquid and electronics screening rules; check your departure country's current guidance before you travel."}
              </p>
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Baggage: </span>
                {fullAirport.baggageRules?.[0]?.content ?? "Baggage allowance is set by your airline and fare class — check your ticket confirmation for specifics."}
              </p>
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Customs: </span>
                {fullAirport.customsInfo?.[0]?.content ?? "Customs allowances vary by nationality and length of stay — check the destination country's official customs authority before you fly."}
              </p>
            </div>
          </GuideSection>

          <GuideSection id="accessibility" title="Accessibility, Families & Pet Travel">
            <div className="space-y-4 text-sm text-ink-600 dark:text-ink-300">
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Accessibility: </span>
                {fullAirport.accessibility?.[0]?.content ?? "Contact the airport or your airline in advance to arrange wheelchair or mobility assistance."}
              </p>
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Traveling with pets: </span>
                {fullAirport.petTravelInfo?.[0]?.content ?? "Pet travel requirements vary by airline and destination — confirm documentation and carrier rules before booking."}
              </p>
            </div>
          </GuideSection>

          <GuideSection id="tips" title="Airport Tips">
            {fullAirport.tips.length === 0 ? (
              <p className="text-sm text-ink-500">Insider tips for this airport are coming soon.</p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-sm text-ink-600 dark:text-ink-300">
                {fullAirport.tips.map((t: any) => (
                  <li key={t.id}>{t.tip}</li>
                ))}
              </ul>
            )}
          </GuideSection>

          <GuideSection id="faqs" title="Frequently Asked Questions">
            <FaqAccordion faqs={fullAirport.faqs} />
          </GuideSection>
        </div>

        <aside className="space-y-6">
          <LocalTimeWidget timezone={airport.timezone} airportName={airport.iata || airport.iataCode || ""} />
          <CurrencyConverter countryIso2={country?.isoCode2 || ""} />
          <FlightStatusWidget iata={airport.iata || airport.iataCode || ""} />
          <WeatherWidget lat={airport.latitude} lon={airport.longitude} />
          <FactsPanel
            iata={airport.iata || airport.iataCode || ""}
            icao={airport.icao || ""}
            city={city?.name || ""}
            country={country?.name || ""}
            timezone={airport.timezone}
            runwayCount={airport.runwayCount}
            terminalCount={airport.terminalCount}
            elevationFt={airport.elevationFt}
            openedYear={airport.openedYear}
            annualPassengers={airport.annualPassengers}
            annualPassengersYear={airport.annualPassengersYear}
          />
          <AdSlot slot="SIDEBAR" />
          {fullAirport.emergencyContacts.length > 0 && (
            <div className="card p-5">
              <p className="eyebrow mb-3">Emergency contacts</p>
              <ul className="space-y-1.5 text-sm">
                {fullAirport.emergencyContacts.map((c: any) => (
                  <li key={c.id} className="flex justify-between">
                    <span className="text-ink-500">{c.label}</span>
                    <span className="font-mono">{c.phone}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {airport.websiteUrl && (
            <a
              href={airport.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-ink-300 px-4 py-3 text-center text-sm font-medium hover:border-signal hover:text-signal-dim dark:border-ink-700"
            >
              Official airport website ↗
            </a>
          )}
          {airport.sourceNotes && (
            <p className="text-xs leading-relaxed text-ink-400">{airport.sourceNotes}</p>
          )}
        </aside>
      </div>

      <div className="container-guide">
        <AdSlot slot="IN_CONTENT" />
      </div>

      <div className="container-guide">
        <RelatedAirports currentAirportId={airport.id} countryId={airport.countryId} />
      </div>
    </>
  );
}
