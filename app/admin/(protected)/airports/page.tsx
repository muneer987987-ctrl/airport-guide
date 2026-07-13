import { db } from "@/lib/db";
import Link from "next/link";
import { updateAirportStatus } from "@/app/admin/actions";
import type { AirportStatus } from "@prisma/client";

export default async function AdminAirportsPage() {
  const airports = await db.airport.findMany({
    include: { city: true, country: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-600">Airports</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-200 text-left text-xs uppercase text-ink-400 dark:border-ink-800">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">IATA</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {airports.map((a) => (
              <tr key={a.id} className="border-b border-ink-100 last:border-0 dark:border-ink-800">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3 font-mono">{a.iata}</td>
                <td className="p-3 text-ink-500">{a.city.name}, {a.country.name}</td>
                <td className="p-3">
                  <StatusForm airportId={a.id} current={a.status} />
                </td>
                <td className="p-3">
                  <Link href={`/admin/airports/${a.id}`} className="text-beacon">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusForm({ airportId, current }: { airportId: string; current: AirportStatus }) {
  async function action(formData: FormData) {
    "use server";
    await updateAirportStatus(airportId, formData.get("status") as AirportStatus);
  }
  return (
    <form action={action} className="flex items-center gap-2">
      <select
        name="status"
        defaultValue={current}
        className="border border-ink-300 bg-transparent px-2 py-1 text-xs dark:border-ink-700"
      >
        <option value="PUBLISHED">Published</option>
        <option value="DRAFT">Draft</option>
        <option value="NEEDS_REVIEW">Needs review</option>
      </select>
      <button type="submit" className="text-xs text-beacon">
        Save
      </button>
    </form>
  );
}
