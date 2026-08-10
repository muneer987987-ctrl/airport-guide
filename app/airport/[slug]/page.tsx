// @ts-nocheck
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function SafeHtml({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={className || "prose prose-lg max-w-none text-gray-700 leading-relaxed"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

async function getAirportBasic(slug: string) {
  return prisma.airport.findUnique({ where: { slug } }) as any;
}

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

export default async function AirportPage(props: any) {
  const params = await props.params;
  const slug = params.slug;

  const airport = await getAirportBasic(slug);
  if (!airport) { notFound(); }
  const related = await getAirportRelated(airport.id);

  return (
    <main className="min-h-screen bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-yellow-400 font-mono text-sm mb-3">
              {airport.iataCode || airport.iata || airport.code || ""} • {related.city?.name || ""}, {related.country?.name || ""}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{airport.name}</h1>
            <p className="text-slate-300 text-lg mb-6">
              {airport.descriptionShort || `Complete guide to ${airport.name}`}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== MAIN CONTENT (LEFT 2/3) ===== */}
          <div className="lg:col-span-2 space-y-10">

            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Overview</h2>
              <SafeHtml html={airport.overview} />
              {airport.history && (
                <>
                  <h3 className="text-xl font-semibold mb-3 mt-8">History</h3>
                  <SafeHtml html={airport.history} className="prose prose-lg max-w-none text-slate-700" />
                </>
              )}
            </section>

            {/* TERMINALS */}
            {related.terminals?.length > 0 && (
              <section id="terminals" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Terminals</h2>
                <div className="grid gap-4">
                  {related.terminals.map((t: any) => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                      <h3 className="font-semibold text-lg mb-2">{t.name}</h3>
                      <SafeHtml html={t.description} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* AIRLINES */}
            {related.airlines?.length > 0 && (
              <section id="airlines" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Major Airlines</h2>
                <div className="flex flex-wrap gap-2">
                  {related.airlines.map((a: any) => (
                    <span key={a.id} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">{a.name}</span>
                  ))}
                </div>
              </section>
            )}

            {/* LOUNGES */}
            {related.lounges?.length > 0 && (
              <section id="lounges" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Lounges</h2>
                <div className="grid gap-4">
                  {related.lounges.map((l: any) => (
                    <div key={l.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                      <h3 className="font-semibold text-lg">{l.name}</h3>
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
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Nearby Hotels</h2>
                <div className="grid gap-4">
                  {related.hotels.map((h: any) => (
                    <div key={h.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                      <h3 className="font-semibold text-lg">{h.name}</h3>
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
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Transfer Options</h2>
                <div className="grid gap-3">
                  {related.transferOptions.map((tr: any) => (
                    <div key={tr.id} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-4">
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
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Parking</h2>
                <div className="grid gap-3">
                  {related.parkingOptions.map((p: any) => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-4">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-slate-500">{p.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* AMENITIES */}
            {related.amenities?.length > 0 && (
              <section id="amenities" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {related.amenities.map((a: any) => (
                    <span key={a.id} className="px-4 py-2 bg-slate-100 rounded-lg text-sm">{a.name}</span>
                  ))}
                </div>
              </section>
            )}

            {/* TRAVEL TIPS */}
            {related.tips?.length > 0 && (
              <section id="tips" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Travel Tips</h2>
                <div className="grid gap-4">
                  {related.tips.map((tip: any) => (
                    <div key={tip.id} className="bg-white border-l-4 border-yellow-400 rounded-r-lg p-5 shadow-sm">
                      <h4 className="font-semibold text-lg mb-2">{tip.title}</h4>
                      <SafeHtml html={tip.content} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {related.faqs?.length > 0 && (
              <section id="faq" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {related.faqs.map((faq: any) => (
                    <div key={faq.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                      <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                      <SafeHtml html={faq.answer} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EMERGENCY CONTACTS */}
            {related.emergencyContacts?.length > 0 && (
              <section id="emergency" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Emergency Contacts</h2>
                <div className="grid gap-3">
                  {related.emergencyContacts.map((ec: any) => (
                    <div key={ec.id} className="bg-white border border-slate-200 rounded-lg p-4">
                      <p className="font-semibold">{ec.name}</p>
                      <p className="text-sm text-slate-500">{ec.phone}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TRANSIT VISA INFO */}
            {related.transitVisaInfo?.length > 0 && (
              <section id="visa" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Transit Visa Information</h2>
                {related.transitVisaInfo.map((v: any) => (
                  <div key={v.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <SafeHtml html={v.description} />
                  </div>
                ))}
              </section>
            )}

            {/* LAYOVER GUIDE */}
            {related.layoverGuide?.length > 0 && (
              <section id="layover" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Layover Guide</h2>
                {related.layoverGuide.map((lg: any) => (
                  <div key={lg.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <SafeHtml html={lg.description} />
                  </div>
                ))}
              </section>
            )}

            {/* ACCESSIBILITY */}
            {related.accessibility?.length > 0 && (
              <section id="accessibility" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Accessibility</h2>
                {related.accessibility.map((a: any) => (
                  <div key={a.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <SafeHtml html={a.description} />
                  </div>
                ))}
              </section>
            )}

            {/* PET TRAVEL */}
            {related.petTravelInfo?.length > 0 && (
              <section id="pet-travel" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Pet Travel Information</h2>
                {related.petTravelInfo.map((p: any) => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <SafeHtml html={p.description} />
                  </div>
                ))}
              </section>
            )}

            {/* CUSTOMS INFO */}
            {related.customsInfo?.length > 0 && (
              <section id="customs" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Customs Information</h2>
                {related.customsInfo.map((c: any) => (
                  <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <SafeHtml html={c.description} />
                  </div>
                ))}
              </section>
            )}

            {/* BAGGAGE RULES */}
            {related.baggageRules?.length > 0 && (
              <section id="baggage" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Baggage Rules</h2>
                {related.baggageRules.map((b: any) => (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <SafeHtml html={b.description} />
                  </div>
                ))}
              </section>
            )}

            {/* SECURITY RULES */}
            {related.securityRules?.length > 0 && (
              <section id="security" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-slate-200">Security Rules</h2>
                {related.securityRules.map((s: any) => (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <SafeHtml html={s.description} />
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* ===== SIDEBAR (RIGHT 1/3) ===== */}
          <aside className="space-y-6">

            {/* QUICK INFO CARD */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Quick Info</h3>
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
                {airport.elevationFt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Elevation</span>
                    <span>{airport.elevationFt} ft</span>
                  </div>
                )}
                {airport.runwayCount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Runways</span>
                    <span>{airport.runwayCount}</span>
                  </div>
                )}
                {airport.openedYear && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Opened</span>
                    <span>{airport.openedYear}</span>
                  </div>
                )}
                {airport.websiteUrl && (
                  <a href={airport.websiteUrl} target="_blank" rel="noopener noreferrer"
                    className="block text-center bg-yellow-400 text-slate-900 font-bold py-2 rounded mt-4 hover:bg-yellow-500">
                    Official Website
                  </a>
                )}
              </div>
            </div>

            {/* IMAGES */}
            {related.images?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {related.images.map((img: any) => (
                    <div key={img.id} className="aspect-video bg-slate-100 rounded overflow-hidden">
                      <img src={img.url} alt={img.alt || airport.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AIRLINES SIDEBAR */}
            {related.airlines?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Major Airlines</h3>
                <div className="flex flex-wrap gap-2">
                  {related.airlines.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-slate-100 rounded text-sm">{a.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* AMENITIES SIDEBAR */}
            {related.amenities?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {related.amenities.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-slate-100 rounded text-sm">{a.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED AIRPORTS - SEO INTERNAL LINKS */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Related Airport Guides</h3>
              <div className="space-y-2">
                <Link href="/airport/london-heathrow-lhr" className="block p-3 bg-slate-50 rounded hover:bg-yellow-50 transition-colors">
                  <p className="font-semibold text-sm">London Heathrow (LHR)</p>
                  <p className="text-xs text-slate-500">United Kingdom</p>
                </Link>
                <Link href="/airport/manchester-airport-man" className="block p-3 bg-slate-50 rounded hover:bg-yellow-50 transition-colors">
                  <p className="font-semibold text-sm">Manchester (MAN)</p>
                  <p className="text-xs text-slate-500">United Kingdom</p>
                </Link>
                <Link href="/airport/amsterdam-schiphol-ams" className="block p-3 bg-slate-50 rounded hover:bg-yellow-50 transition-colors">
                  <p className="font-semibold text-sm">Amsterdam Schiphol (AMS)</p>
                  <p className="text-xs text-slate-500">Netherlands</p>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}