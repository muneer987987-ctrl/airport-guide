import { PrismaClient, AmenityCategory } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Real, web-verified shops and duty-free brands at London Heathrow (T5),
 * sourced from Heathrow's own retail listings and established airport
 * shopping guides. Idempotent — safe to re-run.
 */
 
async function main() {
  const airport = await db.airport.findUnique({ where: { slug: "london-heathrow-lhr" } });
  if (!airport) {
    console.log("Heathrow not found");
    return;
  }
 
  const items: { category: AmenityCategory; name: string; location?: string }[] = [
    { category: AmenityCategory.DUTY_FREE, name: "World Duty Free", location: "Terminal 5, after security" },
    { category: AmenityCategory.SHOP, name: "Harrods", location: "Terminal 5" },
    { category: AmenityCategory.SHOP, name: "Chanel", location: "Terminal 5" },
    { category: AmenityCategory.SHOP, name: "Louis Vuitton", location: "Terminal 5" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "Terminal 5" },
    { category: AmenityCategory.SHOP, name: "Dior", location: "Terminal 5" },
    { category: AmenityCategory.SHOP, name: "The Macallan Boutique", location: "Terminal 5" },
    { category: AmenityCategory.SHOP, name: "John Lewis", location: "Terminal 2" },
    { category: AmenityCategory.SHOP, name: "Bottega Veneta", location: "Terminal 2" },
  ];
 
  for (const item of items) {
    const exists = await db.amenity.findFirst({
      where: { airportId: airport.id, name: item.name, category: item.category },
    });
    if (!exists) {
      await db.amenity.create({ data: { airportId: airport.id, ...item } });
    }
  }
  console.log(`Amenities added for ${airport.name}`);
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });