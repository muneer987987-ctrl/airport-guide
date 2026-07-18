import { PrismaClient } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Adds Lounges, Tips, and well-documented on/near-airport Hotels.
 * Idempotent: checks for existing matching records before creating,
 * so this is safe to run more than once without duplicating data.
 *
 * SOURCING: Lounge and hotel names here are limited to widely-documented,
 * long-standing facilities (hub-carrier lounges, on-airport hotel chains)
 * that are safe to state as general knowledge. Airports where I don't have
 * confident specifics are intentionally left without lounge/hotel entries
 * rather than guessed — verify and add those via /admin as you confirm them.
 */
 
const lounges: Record<string, { name: string; terminal?: string; operator?: string; accessRules?: string }[]> = {
  "london-heathrow-lhr": [
    { name: "British Airways Galleries Lounge", terminal: "Terminal 5", operator: "British Airways", accessRules: "BA Club World/First passengers, Gold/Silver Executive Club members" },
    { name: "Virgin Atlantic Clubhouse", terminal: "Terminal 3", operator: "Virgin Atlantic", accessRules: "Upper Class passengers, Gold Flying Club members" },
  ],
  "dubai-international-dxb": [
    { name: "Emirates First Class Lounge", terminal: "Terminal 3", operator: "Emirates", accessRules: "First Class passengers, top-tier Skywards members" },
    { name: "Marhaba Lounge", terminal: "Terminal 1 / Terminal 3", operator: "Dnata", accessRules: "Priority Pass and paid access accepted" },
  ],
  "new-york-jfk": [
    { name: "Delta Sky Club", terminal: "Terminal 4", operator: "Delta Air Lines", accessRules: "Delta One passengers, Sky Club members" },
    { name: "Admirals Club", terminal: "Terminal 8", operator: "American Airlines", accessRules: "Eligible AAdvantage members and premium cabin passengers" },
  ],
  "paris-charles-de-gaulle-cdg": [
    { name: "Air France Lounge", terminal: "Terminal 2E / 2F", operator: "Air France", accessRules: "Business/La Premiere passengers, Flying Blue Elite members" },
  ],
  "singapore-changi-sin": [
    { name: "SilverKris Lounge", terminal: "Terminal 2 / Terminal 3", operator: "Singapore Airlines", accessRules: "Business/First Class passengers, PPS Club and KrisFlyer Elite Gold members" },
    { name: "The Private Room", terminal: "Terminal 3", operator: "Singapore Airlines", accessRules: "First Class and Suites passengers only" },
  ],
  "tokyo-haneda-hnd": [
    { name: "JAL Sakura Lounge", terminal: "Terminal 1 / Terminal 3", operator: "Japan Airlines", accessRules: "Business Class passengers, JAL Mileage Bank elite members" },
    { name: "ANA Lounge", terminal: "Terminal 2 / Terminal 3", operator: "All Nippon Airways", accessRules: "Business Class passengers, ANA Mileage Club elite members" },
  ],
  "istanbul-airport-ist": [
    { name: "Turkish Airlines CIP Lounge", terminal: "Main Terminal", operator: "Turkish Airlines", accessRules: "Business Class passengers, Miles&Smiles Elite/Elite Plus members" },
  ],
  "doha-hamad-international-doh": [
    { name: "Al Mourjan Business Lounge", terminal: "Passenger Terminal Complex", operator: "Qatar Airways", accessRules: "Business Class passengers, Privilege Club Gold/Platinum members" },
  ],
  "amsterdam-schiphol-ams": [
    { name: "KLM Crown Lounge", terminal: "Terminal / Schengen and Non-Schengen areas", operator: "KLM", accessRules: "Business Class passengers, Flying Blue Elite members" },
  ],
  "frankfurt-fra": [
    { name: "Lufthansa Senator Lounge", terminal: "Terminal 1", operator: "Lufthansa", accessRules: "Business Class passengers, Senator/HON Circle members" },
    { name: "Lufthansa First Class Terminal", terminal: "Terminal 1", operator: "Lufthansa", accessRules: "First Class passengers only, separate dedicated facility" },
  ],
  "toronto-pearson-yyz": [
    { name: "Air Canada Maple Leaf Lounge", terminal: "Terminal 1", operator: "Air Canada", accessRules: "Business Class passengers, Aeroplan Elite members" },
  ],
  "sydney-kingsford-smith-syd": [
    { name: "Qantas Club", terminal: "International Terminal", operator: "Qantas", accessRules: "Qantas Club members, eligible frequent flyers" },
    { name: "Qantas First Lounge", terminal: "International Terminal", operator: "Qantas", accessRules: "First Class passengers only" },
  ],
  "bangkok-suvarnabhumi-bkk": [
    { name: "Royal Orchid Lounge", terminal: "Main Terminal", operator: "Thai Airways", accessRules: "Business/First Class passengers, Royal Orchid Plus elite members" },
  ],
  "kuala-lumpur-international-kul": [
    { name: "Golden Lounge", terminal: "Main Terminal / Satellite", operator: "Malaysia Airlines", accessRules: "Business Class passengers, Enrich elite members" },
  ],
  "hong-kong-international-hkg": [
    { name: "The Wing", terminal: "Terminal 1", operator: "Cathay Pacific", accessRules: "First/Business Class passengers, Marco Polo Club elite members" },
    { name: "The Pier", terminal: "Terminal 1", operator: "Cathay Pacific", accessRules: "First/Business Class passengers" },
  ],
  "delhi-indira-gandhi-del": [
    { name: "Maharaja Lounge", terminal: "Terminal 3", operator: "Air India", accessRules: "Business Class passengers, Flying Returns elite members" },
    { name: "Plaza Premium Lounge", terminal: "Terminal 3", operator: "Plaza Premium", accessRules: "Priority Pass and paid access accepted" },
  ],
};
 
const hotels: Record<string, { name: string; distanceKm?: number; shuttleFree?: boolean }[]> = {
  "london-heathrow-lhr": [
    { name: "Sofitel London Heathrow", distanceKm: 0, shuttleFree: false },
    { name: "Hilton London Heathrow Airport", distanceKm: 0.5, shuttleFree: true },
  ],
  "new-york-jfk": [{ name: "TWA Hotel", distanceKm: 0, shuttleFree: true }],
  "paris-charles-de-gaulle-cdg": [
    { name: "Sheraton Paris Airport Hotel", distanceKm: 0, shuttleFree: false },
    { name: "Hilton Paris Charles de Gaulle Airport", distanceKm: 1, shuttleFree: true },
  ],
  "singapore-changi-sin": [
    { name: "YOTELAIR Singapore Changi", distanceKm: 0, shuttleFree: false },
    { name: "Crowne Plaza Changi Airport", distanceKm: 0, shuttleFree: false },
  ],
  "tokyo-haneda-hnd": [{ name: "Haneda Excel Hotel Tokyu", distanceKm: 0, shuttleFree: false }],
  "doha-hamad-international-doh": [{ name: "Oryx Airport Hotel", distanceKm: 0, shuttleFree: false }],
  "amsterdam-schiphol-ams": [{ name: "Sheraton Amsterdam Airport Hotel", distanceKm: 0, shuttleFree: false }],
  "frankfurt-fra": [
    { name: "Sheraton Frankfurt Airport Hotel", distanceKm: 0, shuttleFree: false },
    { name: "Hilton Frankfurt Airport", distanceKm: 0.5, shuttleFree: true },
  ],
  "sydney-kingsford-smith-syd": [{ name: "Rydges Sydney Airport", distanceKm: 1, shuttleFree: true }],
  "hong-kong-international-hkg": [{ name: "Regal Airport Hotel Hong Kong", distanceKm: 0, shuttleFree: false }],
};
 
// Generic, universally-true travel tips — not airport-specific claims, safe to apply everywhere.
const genericTips = [
  "Arrive at least 3 hours before an international flight and 2 hours before a domestic one, especially during peak travel seasons.",
  "Keep a digital and printed copy of your passport, visa, and hotel booking — some immigration desks still ask for paper copies.",
  "Check your airline's current baggage allowance before you pack; extra-bag fees at the airport are almost always pricier than paying online in advance.",
  "Liquids in carry-on baggage generally need to be in containers of 100ml or less, packed in a single clear resealable bag — rules can vary slightly by country, so check your departure airport's current guidance.",
  "Check live flight status before leaving for the airport — gate and terminal assignments can change closer to departure.",
  "If you have a tight connection, check your airline's minimum connection time for this specific airport before booking, not just the general rule of thumb.",
];
 
async function addLounges() {
  for (const [slug, items] of Object.entries(lounges)) {
    const airport = await db.airport.findUnique({ where: { slug } });
    if (!airport) continue;
    for (const l of items) {
      const exists = await db.lounge.findFirst({ where: { airportId: airport.id, name: l.name } });
      if (!exists) {
        await db.lounge.create({ data: { airportId: airport.id, ...l } });
      }
    }
    console.log(`Lounges done: ${airport.name}`);
  }
}
 
async function addHotels() {
  for (const [slug, items] of Object.entries(hotels)) {
    const airport = await db.airport.findUnique({ where: { slug } });
    if (!airport) continue;
    for (const h of items) {
      const exists = await db.nearbyHotel.findFirst({ where: { airportId: airport.id, name: h.name } });
      if (!exists) {
        await db.nearbyHotel.create({ data: { airportId: airport.id, ...h } });
      }
    }
    console.log(`Hotels done: ${airport.name}`);
  }
}
 
async function addTips() {
  const airports = await db.airport.findMany({ select: { id: true, name: true } });
  for (const airport of airports) {
    const existingCount = await db.airportTip.count({ where: { airportId: airport.id } });
    if (existingCount > 0) {
      console.log(`Tips already present, skipping: ${airport.name}`);
      continue;
    }
    for (let i = 0; i < genericTips.length; i++) {
      await db.airportTip.create({
        data: { airportId: airport.id, tip: genericTips[i], sortOrder: i },
      });
    }
    console.log(`Tips added: ${airport.name}`);
  }
}
 
async function main() {
  console.log("Adding lounges...");
  await addLounges();
  console.log("Adding hotels...");
  await addHotels();
  console.log("Adding tips...");
  await addTips();
  console.log("Done.");
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });