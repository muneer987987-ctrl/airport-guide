import { PrismaClient, AmenityCategory } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Real, web-verified shops and duty-free brands for Paris CDG, Hong Kong,
 * and Frankfurt. Idempotent — safe to re-run.
 */
 
const amenities: Record<string, { category: AmenityCategory; name: string; location?: string }[]> = {
  "paris-charles-de-gaulle-cdg": [
    { category: AmenityCategory.DUTY_FREE, name: "Paris Duty Free", location: "Terminals 1, 2 & 3" },
    { category: AmenityCategory.SHOP, name: "Chanel", location: "Terminal 2E" },
    { category: AmenityCategory.SHOP, name: "Dior", location: "Terminal 2E" },
    { category: AmenityCategory.SHOP, name: "Hermès", location: "Terminal 2E" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Bottega Veneta", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Cartier", location: "Terminal 2E / 2F" },
    { category: AmenityCategory.SHOP, name: "Tiffany & Co", location: "Terminal 2E / 2F" },
  ],
  "hong-kong-international-hkg": [
    { category: AmenityCategory.DUTY_FREE, name: "DFS Duty Free", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Chanel", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Hermès", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Hugo Boss", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Bottega Veneta", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Cartier", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Harrods", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Jimmy Choo", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Godiva Chocolatier", location: "Terminal 1" },
  ],
  "frankfurt-fra": [
    { category: AmenityCategory.DUTY_FREE, name: "Frankfurt Airport Duty Free", location: "Terminal 1 & 2" },
    { category: AmenityCategory.SHOP, name: "Burberry", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Salvatore Ferragamo", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Swarovski", location: "Terminal 1" },
    { category: AmenityCategory.SHOP, name: "Porsche Design", location: "Terminal 1" },
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