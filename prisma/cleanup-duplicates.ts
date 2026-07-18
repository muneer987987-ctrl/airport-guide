import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function dedupeFaqs() {
  const airports = await db.airport.findMany({ select: { id: true, name: true } });
  let totalDeleted = 0;
  for (const airport of airports) {
    const faqs = await db.fAQ.findMany({ where: { airportId: airport.id }, orderBy: { id: "asc" } });
    const seen = new Set<string>();
    const toDelete: string[] = [];
    for (const faq of faqs) {
      const key = faq.question.trim().toLowerCase();
      if (seen.has(key)) { toDelete.push(faq.id); } else { seen.add(key); }
    }
    if (toDelete.length > 0) {
      await db.fAQ.deleteMany({ where: { id: { in: toDelete } } });
      totalDeleted += toDelete.length;
      console.log(`  ${airport.name}: removed ${toDelete.length} duplicate FAQs`);
    }
  }
  console.log(`FAQs: removed ${totalDeleted} duplicates total.`);
}

async function dedupeAmenities() {
  const airports = await db.airport.findMany({ select: { id: true, name: true } });
  let totalDeleted = 0;
  for (const airport of airports) {
    const items = await db.amenity.findMany({ where: { airportId: airport.id }, orderBy: { id: "asc" } });
    const seen = new Set<string>();
    const toDelete: string[] = [];
    for (const item of items) {
      const key = `${item.category}|${item.name.trim().toLowerCase()}|${(item.location ?? "").trim().toLowerCase()}`;
      if (seen.has(key)) { toDelete.push(item.id); } else { seen.add(key); }
    }
    if (toDelete.length > 0) {
      await db.amenity.deleteMany({ where: { id: { in: toDelete } } });
      totalDeleted += toDelete.length;
      console.log(`  ${airport.name}: removed ${toDelete.length} duplicate amenities`);
    }
  }
  console.log(`Amenities: removed ${totalDeleted} duplicates total.`);
}

async function dedupeTransfers() {
  const airports = await db.airport.findMany({ select: { id: true, name: true } });
  let totalDeleted = 0;
  for (const airport of airports) {
    const items = await db.transferOption.findMany({ where: { airportId: airport.id }, orderBy: { id: "asc" } });
    const seen = new Set<string>();
    const toDelete: string[] = [];
    for (const item of items) {
      const key = `${item.type}|${(item.description ?? "").trim().toLowerCase()}`;
      if (seen.has(key)) { toDelete.push(item.id); } else { seen.add(key); }
    }
    if (toDelete.length > 0) {
      await db.transferOption.deleteMany({ where: { id: { in: toDelete } } });
      totalDeleted += toDelete.length;
      console.log(`  ${airport.name}: removed ${toDelete.length} duplicate transfer options`);
    }
  }
  console.log(`Transfers: removed ${totalDeleted} duplicates total.`);
}

async function dedupeParking() {
  const airports = await db.airport.findMany({ select: { id: true, name: true } });
  let totalDeleted = 0;
  for (const airport of airports) {
    const items = await db.parkingOption.findMany({ where: { airportId: airport.id }, orderBy: { id: "asc" } });
    const seen = new Set<string>();
    const toDelete: string[] = [];
    for (const item of items) {
      const key = `${item.type}|${item.name.trim().toLowerCase()}`;
      if (seen.has(key)) { toDelete.push(item.id); } else { seen.add(key); }
    }
    if (toDelete.length > 0) {
      await db.parkingOption.deleteMany({ where: { id: { in: toDelete } } });
      totalDeleted += toDelete.length;
      console.log(`  ${airport.name}: removed ${toDelete.length} duplicate parking options`);
    }
  }
  console.log(`Parking: removed ${totalDeleted} duplicates total.`);
}

async function main() {
  console.log("Cleaning up duplicate FAQs...");
  await dedupeFaqs();
  console.log("Cleaning up duplicate amenities...");
  await dedupeAmenities();
  console.log("Cleaning up duplicate transfer options...");
  await dedupeTransfers();
  console.log("Cleaning up duplicate parking options...");
  await dedupeParking();
  console.log("Cleanup complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });