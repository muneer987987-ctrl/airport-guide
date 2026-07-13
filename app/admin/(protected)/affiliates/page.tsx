import { db } from "@/lib/db";
import { updateAffiliateConfig } from "@/app/admin/actions";
import { AFFILIATE_LABELS } from "@/lib/affiliates";
import type { AffiliateNetwork } from "@prisma/client";

export default async function AdminAffiliatesPage() {
  const configs = await db.affiliateConfig.findMany({ orderBy: { network: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-2xl font-600">Affiliate networks</h1>
      <p className="mb-6 text-sm text-ink-500">
        Links only render on the live site once a network is enabled here with a real
        affiliate/partner ID — there are no placeholder links shown to visitors.
      </p>
      <div className="space-y-3">
        {configs.map((c) => (
          <AffiliateRow key={c.network} network={c.network} affiliateId={c.affiliateId} isEnabled={c.isEnabled} />
        ))}
      </div>
    </div>
  );
}

function AffiliateRow({
  network,
  affiliateId,
  isEnabled,
}: {
  network: AffiliateNetwork;
  affiliateId: string | null;
  isEnabled: boolean;
}) {
  async function action(formData: FormData) {
    "use server";
    await updateAffiliateConfig(network, formData);
  }
  return (
    <form action={action} className="card flex flex-wrap items-center gap-3 p-4">
      <span className="w-56 text-sm font-medium">{AFFILIATE_LABELS[network]}</span>
      <input
        name="affiliateId"
        defaultValue={affiliateId ?? ""}
        placeholder="Affiliate / partner ID"
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
