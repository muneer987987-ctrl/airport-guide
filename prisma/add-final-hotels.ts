import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Final batch of real, web-verified on/near-airport hotels.
 * Idempotent — safe to run more than once.
 *
 * NOTE: Islamabad and Kuwait still have no entries — no confidently
 * documented flagship airport hotel was found for either in this search
 * pass. Add those via /admin once you have a verified source.
 */

const hotels: Record<string, { name: string; distanceKm?: number; shuttleFree?: boolean }[]> = {
  "karachi-jinnah-khi": [
    { name: "Ramada Plaza by Wyndham Karachi Airport Hotel", distanceKm: 1, shuttleFree: true },
  ],
  "lahore-allama-iqbal-lhe": [
    { name: "PC Legacy Lahore Airport", distanceKm: 1, shuttleFree: false },
  ],
  "riyadh-king-khalid-ruh": [
    { name: "Radisson Riyadh Airport", distanceKm: 1, shuttleFree: true },
  ],
  "jeddah-king-abdulaziz-jed": [
    { name: "Aerotel Jeddah", distanceKm: 0, shuttleFree: false },
  ],
  "muscat-international-mct": [
    { name: "Novotel Muscat Airport", distanceKm: 1, shuttleFree: true },
    { name: "Aerotel Muscat", distanceKm: 0, shuttleFree: false },
  ],
  "madrid-barajas-mad": [
    { name: "Hilton Madrid Airport", distanceKm: 0.5, shuttleFree: true },
    { name: "NH Madrid Barajas Airport", distanceKm: 1, shuttleFree: true },
  ],
};

async function main() {
  for (const [slug, items] of Object.entries(hotels)) {
    const airport = await db.airport.findUnique({ where: { slug } });
    if (!airport) {
      console.log(`Skipping (not found): ${slug}`);
      continue;
    }
    for (const h of items) {
      const exists = await db.nearbyHotel.findFirst({ where: { airportId: airport.id, name: h.name } });
      if (!exists) {
        await db.nearbyHotel.create({ data: { airportId: airport.id, ...h } });
      }
    }
    console.log(`Hotels done: ${airport.name}`);
  }
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
