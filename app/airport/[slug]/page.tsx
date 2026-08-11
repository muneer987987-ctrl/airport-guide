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

async function getAirport(slug: string) {
  return db.airport.findUnique({
    where: { slug },
    include: {
      city: true,
      country: true,
      images: { orderBy: { sortOrder: "asc" } },
      terminals: { include: { airlines: { include: { airline: true } } } },
      amenities: true,
      lounges: true,
      hotels: true,
      transferOptions: true,
      parkingOptions: true,
      faqs: { orderBy: { sortOrder: "asc" } },
      tips: { orderBy: { sortOrder: "asc" } },
      emergencyContacts: true,
      transitVisaInfo: true,
      layoverGuide: true,
      accessibility: true,
      petTravelInfo: true,
      customsInfo: true,
      baggageRules: true,
      securityRules: true,
    },
  });
}

// ✅ FREE FIX: Build time pe saare pages generate karo
export async function generateStaticParams() {
  try {
    const airports = await db.airport.findMany({
      select: { slug: true },
      take: 100,
    });
    return airports.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const airport = await getAirport(slug);
  if (!airport) return {};
  return airportMetadata(airport);
}

export default async function AirportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const airport = await getAirport(slug);
  if (!airport || airport.status !== "PUBLISHED") notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: airport.country.name, path: `/country/${airport.country.slug}` },
    { name: airport.city.name, path: `/city/${airport.city.slug}` },
    { name: airport.iata, path: `/airport/${airport.slug}` },
  ];

  return (
    <>
      <script
        {...jsonLdScriptProps([
          airportSchema(airport),
          breadcrumbSchema(breadcrumbItems),
          faqSchema(airport.faqs),
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
            {airport.city.name}, {airport.country.name}
          </p>
          <h1 className="font-display text-3xl font-700 sm:text-4xl">{airport.name}</h1>
          <p className="mt-2 font-mono text-sm text-ink-200">
            {airport.iata} / {airport.icao}
          </p>
        </div>
      </header>

      <div className="container-guide grid grid-cols-1 gap-10 py-10 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0">
          <GuideSection id="overview" title="Overview">
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: airport.overview }} 
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
            iata={airport.iata}
            city={airport.city.name}
            heading="Book flights to this airport"
          />

          <GuideSection id="terminals" title="Terminal Guide">
            <TerminalGuide terminals={airport.terminals} />
          </GuideSection>

          <GuideSection id="amenities" title="Amenities & Services">
            <AmenityGrid amenities={airport.amenities} />
          </GuideSection>

          <AffiliateBlock
            networks={["AIRALO", "SAFETYWING", "VISITORS_COVERAGE"]}
            iata={airport.iata}
            city={airport.city.name}
            heading="Before you fly"
          />

          <GuideSection id="lounges" title="Lounges">
            {airport.lounges.length === 0 ? (
              <p className="text-sm text-ink-500">Lounge listings for this airport are coming soon.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {airport.lounges.map((l) => (
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
              {airport.transferOptions.map((t) => (
                <li key={t.id} className="card p-4 text-sm">
                  <span className="font-mono text-xs uppercase tracking-wide text-signal-dim dark:text-signal">
                    {t.type.replace("_", " ")}
                  </span>
                  <p className="mt-1 text-ink-700 dark:text-ink-200">{t.description}</p>
                </li>
              ))}
            </ul>
            <AffiliateBlock
              networks={["JAYRIDE", "KIWITAXI", "HOLIDAY_TAXIS", "WELCOME_PICKUPS", "DISCOVER_CARS"]}
              iata={airport.iata}
              city={airport.city.name}
              heading="Book ground transport"
            />
          </GuideSection>

          <GuideSection id="parking" title="Parking">
            <ul className="space-y-3">
              {airport.parkingOptions.map((p) => (
                <li key={p.id} className="card p-4 text-sm">
                  <span className="font-mono text-xs uppercase tracking-wide text-signal-dim dark:text-signal">
                    {p.type.replace("_", " ")}
                  </span>
                  <p className="mt-1 font-medium text-ink-800 dark:text-ink-100">{p.name}</p>
                </li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection id="hotels" title="Nearby Hotels">
            {airport.hotels.length === 0 ? (
              <p className="text-sm text-ink-500">Hotel listings for this airport are coming soon.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {airport.hotels.map((h) => (
                  <div key={h.id} className="card p-4 text-sm">
                    <p className="font-display font-600">{h.name}</p>
                    {h.distanceKm && <p className="text-ink-400">{h.distanceKm} km from terminal</p>}
                  </div>
                ))}
              </div>
            )}
            <AffiliateBlock networks={["BOOKING_COM"]} city={airport.city.name} heading="Find a room nearby" />
          </GuideSection>

          <GuideSection id="layover" title="Layover & Transit Guide">
            <p className="text-sm text-ink-600 dark:text-ink-300">
              {airport.layoverGuide?.content ??
                "Detailed layover guidance for this airport is being prepared. As a general rule, check your connection time against the airline's official minimum connection time for this airport before booking a tight transfer."}
            </p>
          </GuideSection>

          <GuideSection id="rules" title="Baggage, Security & Customs">
            <div className="space-y-4 text-sm text-ink-600 dark:text-ink-300">
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Security: </span>
                {airport.securityRules?.content ?? "Follow standard international carry-on liquid and electronics screening rules; check your departure country's current guidance before you travel."}
              </p>
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Baggage: </span>
                {airport.baggageRules?.content ?? "Baggage allowance is set by your airline and fare class — check your ticket confirmation for specifics."}
              </p>
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Customs: </span>
                {airport.customsInfo?.content ?? "Customs allowances vary by nationality and length of stay — check the destination country's official customs authority before you fly."}
              </p>
            </div>
          </GuideSection>

          <GuideSection id="accessibility" title="Accessibility, Families & Pet Travel">
            <div className="space-y-4 text-sm text-ink-600 dark:text-ink-300">
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Accessibility: </span>
                {airport.accessibility?.content ?? "Contact the airport or your airline in advance to arrange wheelchair or mobility assistance."}
              </p>
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Traveling with pets: </span>
                {airport.petTravelInfo?.content ?? "Pet travel requirements vary by airline and destination — confirm documentation and carrier rules before booking."}
              </p>
            </div>
          </GuideSection>

          <GuideSection id="tips" title="Airport Tips">
            {airport.tips.length === 0 ? (
              <p className="text-sm text-ink-500">Insider tips for this airport are coming soon.</p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-sm text-ink-600 dark:text-ink-300">
                {airport.tips.map((t) => (
                  <li key={t.id}>{t.tip}</li>
                ))}
              </ul>
            )}
          </GuideSection>

          <GuideSection id="faqs" title="Frequently Asked Questions">
            <FaqAccordion faqs={airport.faqs} />
          </GuideSection>
        </div>

        <aside className="space-y-6">
          <LocalTimeWidget timezone={airport.timezone} airportName={airport.iata} />
          <CurrencyConverter countryIso2={airport.country.isoCode2} />
          <FlightStatusWidget iata={airport.iata} />
          <WeatherWidget lat={airport.latitude} lon={airport.longitude} />
          <FactsPanel
            iata={airport.iata}
            icao={airport.icao}
            city={airport.city.name}
            country={airport.country.name}
            timezone={airport.timezone}
            runwayCount={airport.runwayCount}
            terminalCount={airport.terminalCount}
            elevationFt={airport.elevationFt}
            openedYear={airport.openedYear}
            annualPassengers={airport.annualPassengers}
            annualPassengersYear={airport.annualPassengersYear}
          />
          <AdSlot slot="SIDEBAR" />
          {airport.emergencyContacts.length > 0 && (
            <div className="card p-5">
              <p className="eyebrow mb-3">Emergency contacts</p>
              <ul className="space-y-1.5 text-sm">
                {airport.emergencyContacts.map((c) => (
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