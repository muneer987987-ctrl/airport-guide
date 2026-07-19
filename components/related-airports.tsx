import { db } from "@/lib/db";
import { AirportCard } from "@/components/airport-card";

export async function RelatedAirports({ currentAirportId, countryId }: { currentAirportId: string; countryId: string }) {
  const related = await db.airport.findMany({
    where: { countryId, status: "PUBLISHED", NOT: { id: currentAirportId } },
    include: { city: true, country: true },
    take: 3,
  });

  if (related.length === 0) return null;

  return (
    <section className="border-t border-ink-100 py-10 dark:border-ink-800">
      <h2 className="mb-5 font-display text-xl font-600">Other airports you might need</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {related.map((a) => (
          <AirportCard key={a.slug} airport={a} />
        ))}
      </div>
    </section>
  );
}