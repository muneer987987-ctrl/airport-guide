// @ts-nocheck
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

// Direct prisma client — no external imports
const prisma = new PrismaClient();

// Helper to safely render HTML
function SafeHtml({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={className || "prose prose-lg max-w-none text-gray-700 leading-relaxed"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// FAST: Only basic airport info
async function getAirportBasic(slug: string) {
  return prisma.airport.findUnique({ where: { slug } }) as any;
}

// FAST: Related data fetched separately in parallel
async function getAirportRelated(airportId: string) {
  const [
    city, country, images, terminals, airlines, amenities,
    lounges, hotels, transferOptions, parkingOptions, faqs,
    tips, emergencyContacts, transitVisaInfo, layoverGuide,
    accessibility, petTravelInfo, customsInfo, baggageRules, securityRules,
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
      <section className="relative bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-yellow-400 font-mono text-sm mb-3">
              {airport.iataCode || airport.iata || airport.code || ""} • {related.city?.name || ""}, {related.country?.name || ""}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {airport.name}
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              {airport.descriptionShort || `Complete guide to ${airport.name}`}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">Overview</h2>
              <SafeHtml html={airport.overview} />
              {airport.history && (
                <>
                  <h3 className="text-lg font-semibold mb-2 mt-6">History</h3>
                  <SafeHtml 
                    html={airport.history} 
                    className="prose prose-lg max-w-none text-slate-700" 
                  />
                </>
              )}
            </section>

            {/* TERMINALS */}
            {related.terminals?.length > 0 && (
              <section id="terminals" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">Terminals</h2>
                <div className="grid gap-4">
                  {related.terminals.map((t: any) => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold mb-2">{t.name}</h3>
                      <SafeHtml html={t.description} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* LOUNGES */}
            {related.lounges?.length > 0 && (
              <section id="lounges" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">Lounges</h2>
                <div className="grid gap-4">
                  {related.lounges.map((l: any) => (
                    <div key={l.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold">{l.name}</h3>
                      <p className="text-slate-500 text-sm">{l.location}</p>
                      <SafeHtml html={l.description} className="mt-2" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* HOTELS */}
            {related.hotels?.length > 0 && (
              <section id="hotels" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">Nearby Hotels</h2>
                <div className="grid gap-4">
                  {related.hotels.map((h: any) => (
                    <div key={h.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold">{h.name}</h3>
                      <p className="text-slate-500 text-sm">{h.distance} • {h.priceRange}</p>
                      <SafeHtml html={h.description} className="mt-2" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TRANSFER OPTIONS */}
            {related.transferOptions?.length > 0 && (
              <section id="transfers" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">Transfer Options</h2>
                <div className="grid gap-3">
                  {related.transferOptions.map((tr: any) => (
                    <div key={tr.id} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3">
                      <div>
                        <p className="font-semibold">{tr.type}</p>
                        <p className="text-sm text-slate-500">{tr.duration}</p>
                      </div>
                      <p className="font-mono text-yellow-600 font-bold">{tr.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PARKING */}
            {related.parkingOptions?.length > 0 && (
              <section id="parking" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">Parking</h2>
                <div className="grid gap-3">
                  {related.parkingOptions.map((p: any) => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-3">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-slate-500">{p.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TIPS */}
            {related.tips?.length > 0 && (
              <section id="tips" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">Travel Tips</h2>
                <div className="grid gap-3">
                  {related.tips.map((tip: any) => (
                    <div key={tip.id} className="bg-white border-l-4 border-yellow-400 rounded-r-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-1">{tip.title}</h4>
                      <SafeHtml html={tip.content} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {related.faqs?.length > 0 && (
              <section id="faq" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200">FAQs</h2>
                <div className="space-y-4">
                  {related.faqs.map((faq: any) => (
                    <div key={faq.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-2">{faq.question}</h4>
                      <SafeHtml html={faq.answer} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* QUICK INFO */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="font-bold mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                {(airport.iataCode || airport.iata || airport.code) && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">IATA Code</span>
                    <span className="font-mono font-bold">{airport.iataCode || airport.iata || airport.code}</span>
                  </div>
                )}
                {airport.icao && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">ICAO</span>
                    <span className="font-mono">{airport.icao}</span>
                  </div>
                )}
                {airport.terminalCount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Terminals</span>
                    <span>{airport.terminalCount}</span>
                  </div>
                )}
                {airport.annualPassengers && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Annual Passengers</span>
                    <span>{airport.annualPassengers}</span>
                  </div>
                )}
                {airport.timezone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timezone</span>
                    <span>{airport.timezone}</span>
                  </div>
                )}
                {airport.websiteUrl && (
                  <a 
                    href={airport.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center bg-yellow-400 text-slate-900 font-bold py-2 rounded mt-4 hover:bg-yellow-500"
                  >
                    Official Website
                  </a>
                )}
              </div>
            </div>

            {/* AIRLINES */}
            {related.airlines?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold mb-4">Major Airlines</h3>
                <div className="flex flex-wrap gap-2">
                  {related.airlines.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-slate-100 rounded text-sm">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AMENITIES */}
            {related.amenities?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {related.amenities.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-slate-100 rounded text-sm">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED AIRPORTS (Hardcoded for SEO) */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="font-bold mb-4">Related Airport Guides</h3>
              <div className="space-y-2">
                <a href="/airport/london-heathrow-lhr" className="block p-3 bg-slate-50 rounded hover:bg-yellow-50 transition-colors">
                  <p className="font-semibold text-sm">London Heathrow (LHR)</p>
                  <p className="text-xs text-slate-500">United Kingdom</p>
                </a>
                <a href="/airport/manchester-airport-man" className="block p-3 bg-slate-50 rounded hover:bg-yellow-50 transition-colors">
                  <p className="font-semibold text-sm">Manchester (MAN)</p>
                  <p className="text-xs text-slate-500">United Kingdom</p>
                </a>
                <a href="/airport/amsterdam-schiphol-ams" className="block p-3 bg-slate-50 rounded hover:bg-yellow-50 transition-colors">
                  <p className="font-semibold text-sm">Amsterdam Schiphol (AMS)</p>
                  <p className="text-xs text-slate-500">Netherlands</p>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}