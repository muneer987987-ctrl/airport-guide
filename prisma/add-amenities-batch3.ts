import { PrismaClient, AmenityCategory } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Real, web-verified shops and duty-free brands for Istanbul and Amsterdam.
 * Idempotent — safe to re-run.
 */
 
const amenities: Record<string, { category: AmenityCategory; name: string; location?: string }[]> = {
  "istanbul-airport-ist": [
    { category: AmenityCategory.DUTY_FREE, name: "Unifree Duty Free", location: "Main Terminal, airside" },
    { category: AmenityCategory.SHOP, name: "Burberry", location: "Main Terminal" },
    { category: AmenityCategory.SHOP, name: "Givenchy", location: "Main Terminal" },
    { category: AmenityCategory.SHOP, name: "Saint Laurent", location: "Main Terminal" },
    { category: AmenityCategory.SHOP, name: "Sunglass Hut", location: "Main Terminal" },
    { category: AmenityCategory.SHOP, name: "Swatch", location: "Main Terminal" },
  ],
  "amsterdam-schiphol-ams": [
    { category: AmenityCategory.DUTY_FREE, name: "Today Duty Free", location: "Schiphol Plaza / Departure Halls" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "Departure Halls" },
    { category: AmenityCategory.SHOP, name: "Hermès", location: "Departure Halls" },
    { category: AmenityCategory.SHOP, name: "Louis Vuitton", location: "Departure Halls" },
    { category: AmenityCategory.SHOP, name: "Cartier", location: "Departure Halls" },
    { category: AmenityCategory.SHOP, name: "Rolex", location: "Departure Halls" },
    { category: AmenityCategory.SHOP, name: "GASSAN Diamonds", location: "Schiphol Plaza" },
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