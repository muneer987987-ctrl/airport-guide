import { db } from "@/lib/db";
import { updateAdPlacement } from "@/app/admin/actions";
import type { AdSlot } from "@prisma/client";

const SLOT_LABELS: Record<AdSlot, string> = {
  HEADER: "Header banner",
  IN_CONTENT: "In-content (airport pages)",
  SIDEBAR: "Sidebar (airport pages)",
  FOOTER: "Footer banner",
  MOBILE_STICKY: "Mobile sticky footer",
};

export default async function AdminAdsPage() {
  const placements = await db.adPlacement.findMany({ orderBy: { slot: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-2xl font-600">Ad placements</h1>
      <p className="mb-6 text-sm text-ink-500">
        Each slot renders nothing on the live site until enabled here with a real Google
        AdSense ad unit ID — never a placeholder box shown to visitors.
      </p>
      <div className="space-y-3">
        {placements.map((p) => (
          <AdRow key={p.slot} slot={p.slot} adUnitId={p.adUnitId} isEnabled={p.isEnabled} />
        ))}
      </div>
    </div>
  );
}

function AdRow({ slot, adUnitId, isEnabled }: { slot: AdSlot; adUnitId: string | null; isEnabled: boolean }) {
  async function action(formData: FormData) {
    "use server";
    await updateAdPlacement(slot, formData);
  }
  return (
    <form action={action} className="card flex flex-wrap items-center gap-3 p-4">
      <span className="w-56 text-sm font-medium">{SLOT_LABELS[slot]}</span>
      <input
        name="adUnitId"
        defaultValue={adUnitId ?? ""}
        placeholder="AdSense ad unit ID"
        className="min-w-[180px] flex-1 border border-ink-300 bg-transparent px-3 py-1.5 text-sm dark:border-ink-700"
      />
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" name="isEnabled" defaultChecked={isEnabled} />
        Enabled
      </label>
      <button type="submit" className="border border-beacon px-3 py-1.5 text-xs text-beacon">
        Save
      </button>
    </form>
  );
}
