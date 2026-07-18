import { PrismaClient } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Real, web-verified lounges for the remaining airports (Karachi, Lahore,
 * Islamabad, Riyadh, Jeddah, Muscat, Kuwait, Madrid, Rome), sourced from
 * airport operator sites, Priority Pass, and established lounge-review
 * outlets. Idempotent — safe to run more than once.
 */
 
const lounges: Record<string, { name: string; terminal?: string; operator?: string; accessRules?: string }[]> = {
  "karachi-jinnah-khi": [
    { name: "PIA Business Plus Lounge", terminal: "International Terminal", operator: "Pakistan International Airlines", accessRules: "Complimentary for PIA Business Class and eligible frequent flyer elites" },
    { name: "CIP Lounge", terminal: "International & Domestic Terminals", operator: "Civil Aviation Authority", accessRules: "Priority Pass and paid walk-in access accepted" },
    { name: "Marhaba Lounge", terminal: "International Terminal", operator: "Dnata / Marhaba", accessRules: "Priority Pass and paid walk-in access accepted" },
  ],
  "lahore-allama-iqbal-lhe": [
    { name: "CIP Lounge", terminal: "International Departures", operator: "Civil Aviation Authority", accessRules: "Priority Pass, eligible bank cards, business/first class, or paid walk-in" },
    { name: "PIA Business Plus Lounge", terminal: "International Departures", operator: "Pakistan International Airlines", accessRules: "Complimentary for PIA Business Class passengers" },
  ],
  "islamabad-international-isb": [
    { name: "CIP Lounge", terminal: "Main Terminal", operator: "Civil Aviation Authority", accessRules: "Complimentary for international First/Business Class; paid walk-in available for others" },
    { name: "Marhaba Lounge", terminal: "Main Terminal", operator: "Dnata / Marhaba", accessRules: "Priority Pass and paid walk-in access accepted" },
  ],
  "riyadh-king-khalid-ruh": [
    { name: "Alfursan Lounge", terminal: "Terminal 4", operator: "Saudia", accessRules: "Complimentary for Alfursan Gold members on First/Business international Saudia flights" },
    { name: "Plaza Premium Lounge", terminal: "Terminal 2", operator: "Plaza Premium", accessRules: "Priority Pass and paid access accepted" },
  ],
  "jeddah-king-abdulaziz-jed": [
    { name: "Alfursan Lounge", terminal: "Terminal 1", operator: "Saudia", accessRules: "Business/First Class Saudia passengers, Alfursan Elite/Elite+ and SkyTeam elite members; paid walk-in available" },
  ],
  "muscat-international-mct": [
    { name: "Plaza Premium Lounge", terminal: "International Departures", operator: "Plaza Premium", accessRules: "Priority Pass and paid access accepted" },
  ],
  "kuwait-international-kwi": [
    { name: "Dasman Premier Lounge", terminal: "Main Terminal", operator: "Kuwait Airways", accessRules: "Priority Pass and eligible airline/bank card access accepted" },
  ],
  "madrid-barajas-mad": [
    { name: "Iberia Dalí Premium Lounge", terminal: "Terminal 4", operator: "Iberia", accessRules: "Business Class passengers, Oneworld Emerald/Sapphire status" },
    { name: "Iberia Velázquez Premium Lounge", terminal: "Terminal 4S", operator: "Iberia", accessRules: "Business Class passengers on non-Schengen departures, Oneworld Emerald/Sapphire status" },
  ],
  "rome-fiumicino-fco": [
    { name: "ITA Airways Piazza di Spagna Lounge", terminal: "Terminal 3", operator: "ITA Airways", accessRules: "ITA Airways and Lufthansa Group premium passengers and elite members" },
    { name: "ITA Airways Hangar Lounge", terminal: "Terminal 1", operator: "ITA Airways", accessRules: "ITA Airways and Lufthansa Group premium passengers and elite members" },
    { name: "Plaza Premium Lounge", terminal: "Terminal 1 & Terminal 3", operator: "Plaza Premium", accessRules: "Priority Pass and paid access accepted" },
  ],
};
 
const hotels: Record<string, { name: string; distanceKm?: number; shuttleFree?: boolean }[]> = {
  "rome-fiumicino-fco": [
    { name: "Hilton Rome Airport", distanceKm: 0, shuttleFree: true },
    { name: "Hilton Garden Inn Rome Airport", distanceKm: 0.5, shuttleFree: true },
  ],
};
 
async function addLounges() {
  for (const [slug, items] of Object.entries(lounges)) {
    const airport = await db.airport.findUnique({ where: { slug } });
    if (!airport) {
      console.log(`Skipping (not found): ${slug}`);
      continue;
    }
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
 
async function main() {
  console.log("Adding lounges...");
  await addLounges();
  console.log("Adding hotels...");
  await addHotels();
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