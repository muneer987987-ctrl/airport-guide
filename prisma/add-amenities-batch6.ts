import { PrismaClient, AmenityCategory } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Real, web-verified shops for Madrid, Kuala Lumpur, and Delhi (Delhi limited
 * to the confirmed duty-free operator, as specific brand names were not
 * confidently found for it in this search pass). Idempotent — safe to re-run.
 */
 
const amenities: Record<string, { category: AmenityCategory; name: string; location?: string }[]> = {
  "madrid-barajas-mad": [
    { category: AmenityCategory.DUTY_FREE, name: "Madrid Duty Free", location: "All four terminals" },
    { category: AmenityCategory.SHOP, name: "Burberry", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "Loewe", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "Longchamp", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "MaxMara", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "Tous", location: "Madrid Duty Free" },
    { category: AmenityCategory.RESTAURANT, name: "Hard Rock Cafe", location: "Terminal 1, Boarding Area B" },
  ],
  "kuala-lumpur-international-kul": [
    { category: AmenityCategory.DUTY_FREE, name: "Eraman Duty Free", location: "KLIA Terminal 1" },
    { category: AmenityCategory.DUTY_FREE, name: "Heinemann", location: "klia2 (Terminal 2)" },
    { category: AmenityCategory.SHOP, name: "Jimmy Choo", location: "Eraman, KLIA Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Le Labo", location: "Heinemann, klia2" },
  ],
  "delhi-indira-gandhi-del": [
    { category: AmenityCategory.DUTY_FREE, name: "Delhi Duty Free", location: "Terminal 3, International Arrivals & Departures" },
  ],
};
 
async function main() {
  for (const [slug, items] of Object.entries(amenities)) {
    const airport = await db.airport.findUnique({ where: { slug } });
    if (!airport) {
      console.log(`Skipping (not found): ${slug}`);
      continue;
    }
    for (const item of items) {
      const exists = await db.amenity.findFirst({
        where: { airportId: airport.id, name: item.name, category: item.category },
      });
      if (!exists) {
        await db.amenity.create({ data: { airportId: airport.id, ...item } });
      }
    }
    console.log(`Amenities done: ${airport.name}`);
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