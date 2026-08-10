// @ts-nocheck
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ NEXT.JS 15 EXACT FORMAT — params is a Promise
export default async function AirportPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // ORIGINAL QUERY — jo pehle kaam kar rahi thi
  const airport = await prisma.airport.findUnique({
    where: { slug },
    include: {
      city: true,
      country: true,
      images: true,
      terminals: true,
      airlines: true,
      amenities: true,
      lounges: true,
      hotels: true,
      transferOptions: true,
      parkingOptions: true,
      faqs: true,
      tips: true,
      emergencyContacts: true,
      transitVisaInfo: true,
      layoverGuide: true,
      accessibility: true,
      petTravelInfo: true,
      customsInfo: true,
      baggageRules: true,
      securityRules: true
    }
  }) as any;

  if (!airport) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative bg-ink-900 text-white py-16 md:py-24">
        <div className="container-guide">
          <div className="max-w-3xl">
            <p className="text-signal font-mono text-sm mb-3">
              {airport.iataCode || airport.iata || ""} • {airport.city?.name || ""}, {airport.country?.name || ""}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-700 mb-4">
              {airport.name}
            </h1>
            <p className="text-ink-200 text-lg mb-6">
              {airport.descriptionShort || `Complete guide to ${airport.name}`}
            </p>
          </div>
        </div>
      </section>

      <div className="container-guide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* OVERVIEW — BAS YEH 2 LINES CHANGE HAIN */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Overview</h2>
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
            </section>

            {/* TERMINALS */}
            {airport.terminals?.length > 0 && (
              <section id="terminals" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Terminals</h2>
                <div className="grid gap-4">
                  {airport.terminals.map((t: any) => (
                    <div key={t.id} className="card p-4">
                      <h3 className="font-display font-600 mb-2">{t.name}</h3>
                      <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: t.description || "" }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* AIRLINES */}
            {airport.airlines?.length > 0 && (
              <section id="airlines" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Major Airlines</h2>
                <div className="flex flex-wrap gap-2">
                  {airport.airlines.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-ink-100 rounded text-sm">{a.name}</span>
                  ))}
                </div>
              </section>
            )}

            {/* LOUNGES */}
            {airport.lounges?.length > 0 && (
              <section id="lounges" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Lounges</h2>
                <div className="grid gap-4">
                  {airport.lounges.map((l: any) => (
                    <div key={l.id} className="card p-4">
                      <h3 className="font-display font-600">{l.name}</h3>
                      <p className="text-ink-500 text-sm">{l.location}</p>
                      <div className="prose max-w-none text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: l.description || "" }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* HOTELS */}
            {airport.hotels?.length > 0 && (
              <section id="hotels" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Nearby Hotels</h2>
                <div className="grid gap-4">
                  {airport.hotels.map((h: any) => (
                    <div key={h.id} className="card p-4">
                      <h3 className="font-display font-600">{h.name}</h3>
                      <p className="text-ink-500 text-sm">{h.distance} • {h.priceRange}</p>
                      <div className="prose max-w-none text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: h.description || "" }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TRANSFERS */}
            {airport.transferOptions?.length > 0 && (
              <section id="transfers" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Transfer Options</h2>
                <div className="grid gap-3">
                  {airport.transferOptions.map((tr: any) => (
                    <div key={tr.id} className="flex justify-between items-center card p-3">
                      <div>
                        <p className="font-600">{tr.type}</p>
                        <p className="text-sm text-ink-500">{tr.duration}</p>
                      </div>
                      <p className="font-mono text-signal">{tr.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PARKING */}
            {airport.parkingOptions?.length > 0 && (
              <section id="parking" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Parking</h2>
                <div className="grid gap-3">
                  {airport.parkingOptions.map((p: any) => (
                    <div key={p.id} className="card p-3">
                      <p className="font-600">{p.name}</p>
                      <p className="text-sm text-ink-500">{p.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* AMENITIES */}
            {airport.amenities?.length > 0 && (
              <section id="amenities" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {airport.amenities.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-ink-100 rounded text-sm">{a.name}</span>
                  ))}
                </div>
              </section>
            )}

            {/* TIPS */}
            {airport.tips?.length > 0 && (
              <section id="tips" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Travel Tips</h2>
                <div className="grid gap-3">
                  {airport.tips.map((tip: any) => (
                    <div key={tip.id} className="card p-4 border-l-4 border-signal">
                      <h4 className="font-600 mb-1">{tip.title}</h4>
                      <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: tip.content || "" }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {airport.faqs?.length > 0 && (
              <section id="faq" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">FAQs</h2>
                <div className="space-y-4">
                  {airport.faqs.map((faq: any) => (
                    <div key={faq.id} className="card p-4">
                      <h4 className="font-600 mb-2">{faq.question}</h4>
                      <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer || "" }} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EMERGENCY */}
            {airport.emergencyContacts?.length > 0 && (
              <section id="emergency" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Emergency Contacts</h2>
                <div className="grid gap-3">
                  {airport.emergencyContacts.map((ec: any) => (
                    <div key={ec.id} className="card p-3">
                      <p className="font-600">{ec.name}</p>
                      <p className="text-sm text-ink-500">{ec.phone}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* VISA INFO */}
            {airport.transitVisaInfo?.length > 0 && (
              <section id="visa" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Transit Visa Information</h2>
                {airport.transitVisaInfo.map((v: any) => (
                  <div key={v.id} className="card p-4 mb-4">
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: v.description || "" }} />
                  </div>
                ))}
              </section>
            )}

            {/* LAYOVER */}
            {airport.layoverGuide?.length > 0 && (
              <section id="layover" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Layover Guide</h2>
                {airport.layoverGuide.map((lg: any) => (
                  <div key={lg.id} className="card p-4 mb-4">
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: lg.description || "" }} />
                  </div>
                ))}
              </section>
            )}

            {/* ACCESSIBILITY */}
            {airport.accessibility?.length > 0 && (
              <section id="accessibility" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Accessibility</h2>
                {airport.accessibility.map((a: any) => (
                  <div key={a.id} className="card p-4 mb-4">
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: a.description || "" }} />
                  </div>
                ))}
              </section>
            )}

            {/* PET TRAVEL */}
            {airport.petTravelInfo?.length > 0 && (
              <section id="pet-travel" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Pet Travel Information</h2>
                {airport.petTravelInfo.map((p: any) => (
                  <div key={p.id} className="card p-4 mb-4">
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: p.description || "" }} />
                  </div>
                ))}
              </section>
            )}

            {/* CUSTOMS */}
            {airport.customsInfo?.length > 0 && (
              <section id="customs" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Customs Information</h2>
                {airport.customsInfo.map((c: any) => (
                  <div key={c.id} className="card p-4 mb-4">
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: c.description || "" }} />
                  </div>
                ))}
              </section>
            )}

            {/* BAGGAGE */}
            {airport.baggageRules?.length > 0 && (
              <section id="baggage" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Baggage Rules</h2>
                {airport.baggageRules.map((b: any) => (
                  <div key={b.id} className="card p-4 mb-4">
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: b.description || "" }} />
                  </div>
                ))}
              </section>
            )}

            {/* SECURITY */}
            {airport.securityRules?.length > 0 && (
              <section id="security" className="scroll-mt-24">
                <h2 className="font-display text-2xl font-700 mb-4 pb-2 border-b border-ink-200">Security Rules</h2>
                {airport.securityRules.map((s: any) => (
                  <div key={s.id} className="card p-4 mb-4">
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: s.description || "" }} />
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">

            {/* QUICK INFO */}
            <div className="card p-5">
              <h3 className="font-display font-600 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                {(airport.iataCode || airport.iata) && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">IATA Code</span>
                    <span className="font-mono font-600">{airport.iataCode || airport.iata}</span>
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
                {airport.elevationFt && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">Elevation</span>
                    <span>{airport.elevationFt} ft</span>
                  </div>
                )}
                {airport.runwayCount && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">Runways</span>
                    <span>{airport.runwayCount}</span>
                  </div>
                )}
                {airport.openedYear && (
                  <div className="flex justify-between">
                    <span className="text-ink-500">Opened</span>
                    <span>{airport.openedYear}</span>
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

            {/* IMAGES */}
            {airport.images?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-600 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {airport.images.map((img: any) => (
                    <div key={img.id} className="aspect-video bg-ink-100 rounded overflow-hidden">
                      <img src={img.url} alt={img.alt || airport.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AIRLINES SIDEBAR */}
            {airport.airlines?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-600 mb-4">Major Airlines</h3>
                <div className="flex flex-wrap gap-2">
                  {airport.airlines.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-ink-100 rounded text-sm">{a.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* AMENITIES SIDEBAR */}
            {airport.amenities?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-600 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {airport.amenities.map((a: any) => (
                    <span key={a.id} className="px-3 py-1 bg-ink-100 rounded text-sm">{a.name}</span>
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