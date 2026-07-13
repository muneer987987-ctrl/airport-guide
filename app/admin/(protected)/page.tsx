import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [total, published, draft, needsReview] = await Promise.all([
    db.airport.count(),
    db.airport.count({ where: { status: "PUBLISHED" } }),
    db.airport.count({ where: { status: "DRAFT" } }),
    db.airport.count({ where: { status: "NEEDS_REVIEW" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-600">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total airports" value={total} />
        <StatCard label="Published" value={published} accent="text-go" />
        <StatCard label="Draft" value={draft} accent="text-signal-dim" />
        <StatCard label="Needs review" value={needsReview} accent="text-stop" />
      </div>
      <div className="mt-8">
        <Link href="/admin/airports" className="border border-beacon px-4 py-2 text-sm text-beacon">
          Manage airports →
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="card p-4">
      <div className={`font-mono text-2xl ${accent ?? "text-ink-800 dark:text-ink-100"}`}>{value}</div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  );
}
