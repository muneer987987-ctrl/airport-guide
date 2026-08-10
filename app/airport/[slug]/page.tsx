// @ts-nocheck
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GuideSection } from "@/components/guide-section";
import { ShareButton } from "@/components/share-button";
import { Suspense } from "react";

// Helper to safely get HTML content
function SafeHtml({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={className || "prose prose-lg max-w-none text-gray-700 leading-relaxed"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// FAST: Only basic airport info (no heavy includes)
async function getAirportBasic(slug: string) {
  return prisma.airport.findUnique({
    where: { slug },
  }) as any;
}

// FAST: Related data fetched separately in parallel
async function getAirportRelated(airportId: string) {
  const [
    city,
    country,
    images,
    terminals,
    airlines,
    amenities,
    lounges,
    hotels,
    transferOptions,
    parkingOptions,
    faqs,
    tips,
    emergencyContacts,
    transitVisaInfo,
    layoverGuide,
    accessibility,
    petTravelInfo,
    customsInfo,
    baggageRules,
    securityRules,
  ] = await Promise.all([
    prisma.city.findFirst({ where: { airports: { some: { id: airportId } } } }).catch(() => null),
    prisma.country.findFirst({ where: { airports: { some: { id: airportId } } } }).catch(() => null),
    prisma.airportImage.findMany({ where: { airportId } }).catch(() => []),
    prisma.terminal.findMany({ where: { airportId } }).catch(() => []),
    prisma.airline.findMany({ where: { airports: { some: { id: airportId } } } }).catch(() => []),
    prisma.amenity.findMany({ where: { airportId } }).catch(() => []),
    prisma.lounge.findMany({ where: { airportId } }).catch(() => []),
    prisma.nearbyHotel.findMany({ where: { airportId } }).catch(() => []),
    prisma.transferOption.findMany({ where: { airportId } }).catch(() => []),
    prisma.parkingOption.findMany({ where: { airportId } }).catch(() => []),
    prisma.fAQ.findMany({ where: { airportId } }).catch(() => []),
    prisma.airportTip.findMany({ where: { airportId } }).catch(() => []),
    prisma.emergencyContact.findMany({ where: { airportId } }).catch(() => []),
    prisma.transitVisaInfo.findMany({ where: { airportId } }).catch(() => []),
    prisma.layoverGuide.findMany({ where: { airportId } }).catch(() => []),
    prisma.accessibility.findMany({ where: { airportId } }).catch(() => []),
    prisma.petTravelInfo.findMany({ where: { airportId } }).catch(() => []),
    prisma.customsInfo.findMany({ where: { airportId } }).catch(() => []),
    prisma.baggageRule.findMany({ where: { airportId } }).catch(() => []),
    prisma.securityRule.findMany({ where: { airportId } }).catch(() => []),
  ]);

  return {
    city, country, images, terminals, airlines, amenities,
    lounges, hotels, transferOptions, parkingOptions, faqs,
    tips, emergencyContacts, transitVisaInfo, layoverGuide,
    accessibility, petTravelInfo, customsInfo, baggageRules, securityRules,
  };
}

export default async function AirportPage({ params }: { params: { slug: string } }) {
  const airport = await getAirportBasic(params.slug);

  if (!airport) {
    notFound();
  }

  const related = await getAirportRelated(airport.id);

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative bg-ink-900 text-white py-16 md:py-24">
        <div className="container-guide">
          <div className="max-w-3xl">
            <p className="text-signal font-mono text-sm mb-3">
              {airport.iataCode} • {related.city?.name || ""}, {related.country?.name || ""}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-700 mb-4">
              {airport.name}
            </h1>
            <p className="text-ink-200 text-lg mb-6">
              {airport.descriptionShort || `Complete guide to ${airport.name}`}
            </p>
            <ShareButton title={airport.name} />
          </div>
        </div>
      </section>

      <div className="container-guide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* OVERVIEW */}
            <GuideSection id="overview" title="Overview">
              <SafeHtml html={airport.overview} />
              {airport.history && (
                <>
                  <h3 className="mb-2 mt-6 font-display text-base font-600">History</h3>
                  <SafeHtml 
                    html={airport.history} 
                    className="prose prose-lg max-w-none text-ink-700 dark:text-ink-200" 
                  />
                </>
              )}
            </GuideSection>

            {/* TERMINALS */}
            {related.terminals?.length > 0 && (
              <GuideSection id="terminals" title="Terminals">
                <div className="grid gap-4">
                  {related.terminals.map((t: any) => (
                    <div key={t.id} className="card p-4">
                      <h3 className="font-display font-600 mb-2">{t.name}</h3>
                      <SafeHtml html={t.description} />
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* LOUNGES */}
            {related.lounges?.length > 0 && (
              <GuideSection id="lounges" title="Lounges">
                <div className="grid gap-4">
                  {related.lounges.map((l: any) => (
                    <div key={l.id} className="card p-4">
                      <h3 className="font-display font-600">{l.name}</h3>
                      <p className="text-ink-500 text-sm">{l.location}</p>
                      <SafeHtml html={l.description} className="mt-2" />
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* HOTELS */}
            {related.hotels?.length > 0 && (
              <GuideSection id="hotels" title="Nearby Hotels">
                <div className="grid gap-4">
                  {related.hotels.map((h: any) => (
                    <div key={h.id} className="card p-4">
                      <h3 className="font-display font-600">{h.name}</h3>
                      <p className="text-ink-500 text-sm">{h.distance} • {h.priceRange}</p>
                      <SafeHtml html={h.description} className="mt-2" />
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* TRANSFER OPTIONS */}
            {related.transferOptions?.length > 0 && (
              <GuideSection id="transfers" title="Transfer Options">
                <div className="grid gap-3">
                  {related.transferOptions.map((tr: any) => (
                    <div key={tr.id} className="flex justify-between items-center card p-3">
                      <div>
                        <p className="font-600">{tr.type}</p>
                        <p className="text-sm text-ink-500">{tr.duration}</p>
                      </div>
                      <p className="font-mono text-signal">{tr.price}</p>
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* PARKING */}
            {related.parkingOptions?.length > 0 && (
              <GuideSection id="parking" title="Parking">
                <div className="grid gap-3">
                  {related.parkingOptions.map((p: any) => (
                    <div key={p.id} className="card p-3">
                      <p className="font-600">{p.name}</p>
                      <p className="text-sm text-ink-500">{p.price}</p>
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* TIPS */}
            {related.tips?.length > 0 && (
              <GuideSection id="tips" title="Travel Tips">
                <div className="grid gap-3">
                  {related.tips.map((tip: any) => (
                    <div key={tip.id} className="card p-4 border-l-4 border-signal">
                      <h4 className="font-600 mb-1">{tip.title}</h4>
                      <SafeHtml html={tip.content} />
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* FAQ */}
            {related.faqs?.length > 0 && (
              <GuideSection id="faq" title="FAQs">
                <div className="space-y-4">
                  {related.faqs.map((faq: any) => (
                    <div key={faq.id} className="card p-4">
                      <h4 className="font-600 mb-2">{faq.question}</h4>
                      <SafeHtml html={faq.answer} />
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* QUICK INFO */}
            <div className="card p-5">
              <h3 className="font-display font-600 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                {airport.iataCode && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">IATA Code</span>
                    <span className="font-mono font-600">{airport.iataCode}</span>
                  </div>
                )}
                {airport.icao && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">ICAO</span>
                    <span className="font-mono">{airport.icao}</span>
                  </div>
                )}
                {airport.terminalCount && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">Terminals</span>
                    <span>{airport.terminalCount}</span>
                  </div>
                )}
                {airport.annualPassengers && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">Annual Passengers</span>
                    <span>{airport.annualPassengers}</span>
                  </div>
                )}
                {airport.timezone && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">Timezone</span>
                    <span>{airport.timezone}</span>
                  </div>
                )}
                {airport.websiteUrl && (
                  <a 
                    href={airport.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center bg-signal text-ink-900 font-600 py-2 rounded mt-4 hover:opacity-90"
                  >
                    Official Website
                  </a>
                )}
              </div>
            </div>

            {/* AIRLINES */}
            {related.airlines?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-600 mb-4">Major Airlines</h3>
                <div className="flex flex-wrap gap-2">
                  {related.airlines.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-ink-100 rounded text-sm">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AMENITIES */}
            {related.amenities?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-600 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {related.amenities.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-ink-100 rounded text-sm">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}