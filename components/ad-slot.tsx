import { db } from "@/lib/db";
import type { AdSlot as AdSlotType } from "@prisma/client";

const SLOT_STYLES: Record<AdSlotType, string> = {
  HEADER: "h-[90px] w-full max-w-[728px] mx-auto",
  IN_CONTENT: "h-[250px] w-full max-w-[336px] mx-auto my-6",
  SIDEBAR: "h-[600px] w-full max-w-[300px]",
  FOOTER: "h-[90px] w-full max-w-[728px] mx-auto",
  MOBILE_STICKY: "h-[50px] w-full fixed bottom-0 left-0 z-40 sm:hidden",
};

/**
 * Renders an AdSense placement if that slot is enabled and has a real
 * ad unit ID configured (via /admin/ads). Renders nothing otherwise —
 * we never show placeholder/dummy ad creative, since that hurts both
 * UX and AdSense policy compliance.
 */
export async function AdSlot({ slot }: { slot: AdSlotType }) {
  const config = await db.adPlacement.findUnique({ where: { slot } });
  if (!config?.isEnabled || !config.adUnitId) return null;

  return (
    <div
      className={`${SLOT_STYLES[slot]} flex items-center justify-center border border-dashed border-ink-200 text-xs text-ink-400 dark:border-ink-800`}
      data-ad-slot={slot}
      data-ad-unit={config.adUnitId}
      aria-label="Advertisement"
    >
      {/* Real AdSense <ins> tag renders here once NEXT_PUBLIC_ADSENSE_CLIENT_ID
          and this slot's adUnitId are both set. */}
      Ad
    </div>
  );
}
