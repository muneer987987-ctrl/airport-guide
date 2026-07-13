import { getAffiliateConfigs, AFFILIATE_LABELS } from "@/lib/affiliates";
import type { AffiliateNetwork } from "@prisma/client";

/**
 * Renders one or more affiliate CTAs for a given context (e.g. an airport
 * page's "Transfers" section). Silently renders nothing for any network
 * that isn't enabled with a real affiliate ID — never shows a dead/fake link.
 */
export async function AffiliateBlock({
  networks,
  iata,
  city,
  heading,
}: {
  networks: AffiliateNetwork[];
  iata?: string;
  city?: string;
  heading?: string;
}) {
  const configs = await getAffiliateConfigs();
  const active = configs.filter((c) => networks.includes(c.network) && c.isEnabled);
  if (active.length === 0) return null;

  return (
    <div className="card my-6 p-4">
      {heading && <p className="eyebrow mb-3">{heading}</p>}
      <div className="flex flex-wrap gap-3">
        {active.map((c) => {
          const url = c.buildUrl({ iata, city });
          if (!url) return null;
          return (
            <a
              key={c.network}
              href={url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="border border-beacon px-4 py-2 text-sm font-medium text-beacon hover:bg-beacon hover:text-white transition-colors"
            >
              {AFFILIATE_LABELS[c.network]}
            </a>
          );
        })}
      </div>
    </div>
  );
}
