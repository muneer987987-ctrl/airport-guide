import { PrismaClient, AmenityCategory } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Real, web-verified shops and duty-free brands for Bangkok, Tokyo Haneda,
 * Toronto, and Sydney. Idempotent — safe to re-run.
 */
 
const amenities: Record<string, { category: AmenityCategory; name: string; location?: string }[]> = {
  "bangkok-suvarnabhumi-bkk": [
    { category: AmenityCategory.DUTY_FREE, name: "King Power Duty Free", location: "Terminal Level 4" },
    { category: AmenityCategory.SHOP, name: "Guylian Chocolate", location: "King Power Duty Free area" },
  ],
  "tokyo-haneda-hnd": [
    { category: AmenityCategory.DUTY_FREE, name: "TIAT Duty Free Shop Central", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Chanel", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Cartier", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Prada", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Uniqlo", location: "Terminal 1" },
  ],
  "toronto-pearson-yyz": [
    { category: AmenityCategory.DUTY_FREE, name: "Toronto Duty Free (Dufry)", location: "Terminal 1 & Terminal 3" },
    { category: AmenityCategory.SHOP, name: "Coach", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Burberry", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Salvatore Ferragamo", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Hudson's Bay Company Trading Post", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Rocky Mountain Chocolate", location: "Terminal 1" },
  ],
  "sydney-kingsford-smith-syd": [
    { category: AmenityCategory.DUTY_FREE, name: "Heinemann Tax & Duty Free", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Chanel", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Dior", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Burberry", location: "International Terminal" },
    { category: AmenityCategory.SHOP, name: "Fendi", location: "International Terminal" },
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