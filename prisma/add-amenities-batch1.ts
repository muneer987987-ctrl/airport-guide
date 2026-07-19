import { PrismaClient, AmenityCategory } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Real, web-verified shops, duty-free brands, and restaurants for 5 major
 * airports: Dubai, Singapore Changi, JFK, and Doha (Heathrow was already
 * added separately). Sourced from airport operator sites and established
 * travel guides. Idempotent — safe to re-run.
 */
 
const amenities: Record<string, { category: AmenityCategory; name: string; location?: string }[]> = {
  "dubai-international-dxb": [
    { category: AmenityCategory.DUTY_FREE, name: "Dubai Duty Free", location: "Terminals 1, 2 & 3" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "Terminal 3, Concourse A" },
    { category: AmenityCategory.SHOP, name: "Chanel", location: "Terminal 3, Concourse A" },
    { category: AmenityCategory.SHOP, name: "Louis Vuitton", location: "Terminal 3" },
    { category: AmenityCategory.SHOP, name: "Cartier", location: "Terminal 3" },
    { category: AmenityCategory.SHOP, name: "Tiffany & Co", location: "Terminal 3" },
    { category: AmenityCategory.SHOP, name: "Rolex", location: "Terminal 3" },
    { category: AmenityCategory.SHOP, name: "The Macallan Boutique", location: "Terminal 3, Concourse A" },
    { category: AmenityCategory.PHARMACY, name: "Boots Pharmacy", location: "Terminal 3" },
  ],
  "singapore-changi-sin": [
    { category: AmenityCategory.DUTY_FREE, name: "DFS Wines & Spirits", location: "Departure Transit Malls, T1-T4" },
    { category: AmenityCategory.DUTY_FREE, name: "The Shilla Duty Free", location: "All terminals" },
    { category: AmenityCategory.SHOP, name: "Apple", location: "Terminal 3" },
    { category: AmenityCategory.SHOP, name: "Tiffany & Co", location: "Departure Transit Mall" },
    { category: AmenityCategory.SHOP, name: "Charles & Keith", location: "Multiple terminals" },
    { category: AmenityCategory.COFFEE_SHOP, name: "TWG Tea", location: "Terminal 3" },
  ],
  "new-york-jfk": [
    { category: AmenityCategory.DUTY_FREE, name: "DFS Duty Free", location: "Terminal 4" },
    { category: AmenityCategory.RESTAURANT, name: "The Palm Bar & Grille", location: "Terminal 4" },
    { category: AmenityCategory.FAST_FOOD, name: "Shake Shack", location: "Terminal 4, Gate B22 & Terminal 8" },
    { category: AmenityCategory.FAST_FOOD, name: "Buffalo Wild Wings", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "Hugo Boss", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "Coach", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "Kate Spade", location: "Terminal 4" },
    { category: AmenityCategory.SHOP, name: "Brooks Brothers", location: "Terminal 4" },
  ],
  "doha-hamad-international-doh": [
    { category: AmenityCategory.DUTY_FREE, name: "Qatar Duty Free", location: "The Orchard & main concourses" },
    { category: AmenityCategory.SHOP, name: "Louis Vuitton", location: "The Orchard" },
    { category: AmenityCategory.SHOP, name: "Gucci", location: "The Orchard" },
    { category: AmenityCategory.SHOP, name: "Dior", location: "The Orchard" },
    { category: AmenityCategory.SHOP, name: "Giorgio Armani", location: "The Orchard" },
    { category: AmenityCategory.RESTAURANT, name: "Wagamama", location: "The Orchard" },
    { category: AmenityCategory.RESTAURANT, name: "Gordon Ramsay Burger", location: "Main terminal" },
    { category: AmenityCategory.COFFEE_SHOP, name: "Harrods Tea Room", location: "Main terminal" },
    { category: AmenityCategory.FAST_FOOD, name: "Burger King", location: "Main terminal" },
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