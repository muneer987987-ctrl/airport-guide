import { db } from "./db";
import type { AffiliateNetwork } from "@prisma/client";

/**
 * Maps each supported network to the env var used as a local-dev fallback.
 * In production, AffiliateConfig rows (managed at /admin/affiliates) take
 * precedence — this lets marketing rotate IDs without a redeploy.
 */
const ENV_FALLBACKS: Record<AffiliateNetwork, string | undefined> = {
  TRAVELPAYOUTS: process.env.TRAVELPAYOUTS_AFFILIATE_ID,
  AIRALO: process.env.AIRALO_AFFILIATE_ID,
  DISCOVER_CARS: process.env.DISCOVER_CARS_AFFILIATE_ID,
  SAFETYWING: process.env.SAFETYWING_AFFILIATE_ID,
  VISITORS_COVERAGE: process.env.VISITORS_COVERAGE_AFFILIATE_ID,
  WELCOME_PICKUPS: process.env.WELCOME_PICKUPS_AFFILIATE_ID,
  JAYRIDE: process.env.JAYRIDE_AFFILIATE_ID,
  KIWITAXI: process.env.KIWITAXI_AFFILIATE_ID,
  HOLIDAY_TAXIS: process.env.HOLIDAY_TAXIS_AFFILIATE_ID,
  BOOKING_COM: process.env.BOOKING_COM_AFFILIATE_ID,
  VIATOR: process.env.VIATOR_AFFILIATE_ID,
  GET_YOUR_GUIDE: process.env.GET_YOUR_GUIDE_AFFILIATE_ID,
};

/** Base deep-link templates. {IATA} / {CITY} / {AFFID} are replaced at render time. */
const BASE_URL_DEFAULTS: Record<AffiliateNetwork, string> = {
  TRAVELPAYOUTS: "https://www.aviasales.com/search/{IATA}?marker={AFFID}",
  AIRALO: "https://www.airalo.com/{CITY}-esim?ref={AFFID}",
  DISCOVER_CARS: "https://www.discovercars.com/?affiliate={AFFID}&airport={IATA}",
  SAFETYWING: "https://safetywing.com/nomad-insurance/?referenceID={AFFID}",
  VISITORS_COVERAGE: "https://www.visitorscoverage.com/?aff={AFFID}",
  WELCOME_PICKUPS: "https://www.welcomepickups.com/?airport={IATA}&aff={AFFID}",
  JAYRIDE: "https://www.jayride.com/airport-transfers/{IATA}?aff={AFFID}",
  KIWITAXI: "https://kiwitaxi.com/?airport={IATA}&partner={AFFID}",
  HOLIDAY_TAXIS: "https://www.holidaytaxis.com/?airport={IATA}&aff={AFFID}",
  BOOKING_COM: "https://www.booking.com/searchresults.html?aid={AFFID}&ss={CITY}",
  VIATOR: "https://www.viator.com/searchResults/all?text={CITY}&pid={AFFID}",
  GET_YOUR_GUIDE: "https://www.getyourguide.com/s/?q={CITY}&partner_id={AFFID}",
};

export type ResolvedAffiliate = {
  network: AffiliateNetwork;
  isEnabled: boolean;
  buildUrl: (params: { iata?: string; city?: string }) => string | null;
};

/** Fetches all affiliate configs, merging DB overrides with env fallbacks. */
export async function getAffiliateConfigs(): Promise<ResolvedAffiliate[]> {
  const dbConfigs = await db.affiliateConfig.findMany();
  const dbByNetwork = new Map(dbConfigs.map((c) => [c.network, c]));

  return (Object.keys(BASE_URL_DEFAULTS) as AffiliateNetwork[]).map((network) => {
    const dbConfig = dbByNetwork.get(network);
    const affiliateId = dbConfig?.affiliateId ?? ENV_FALLBACKS[network] ?? null;
    const baseUrl = dbConfig?.baseUrl ?? BASE_URL_DEFAULTS[network];
    const isEnabled = (dbConfig?.isEnabled ?? false) && Boolean(affiliateId);

    return {
      network,
      isEnabled,
      buildUrl: ({ iata, city }) => {
        if (!isEnabled || !affiliateId) return null;
        return baseUrl
          .replace("{AFFID}", affiliateId)
          .replace("{IATA}", iata ?? "")
          .replace("{CITY}", city ? encodeURIComponent(city.toLowerCase()) : "");
      },
    };
  });
}

export const AFFILIATE_LABELS: Record<AffiliateNetwork, string> = {
  TRAVELPAYOUTS: "Flights (Travelpayouts)",
  AIRALO: "eSIM (Airalo)",
  DISCOVER_CARS: "Car Rental (DiscoverCars)",
  SAFETYWING: "Travel Insurance (SafetyWing)",
  VISITORS_COVERAGE: "Travel Insurance (VisitorsCoverage)",
  WELCOME_PICKUPS: "Private Transfer (Welcome Pickups)",
  JAYRIDE: "Airport Transfer (Jayride)",
  KIWITAXI: "Airport Taxi (Kiwitaxi)",
  HOLIDAY_TAXIS: "Airport Taxi (HolidayTaxis)",
  BOOKING_COM: "Hotels (Booking.com)",
  VIATOR: "Tours & Activities (Viator)",
  GET_YOUR_GUIDE: "Tours & Activities (GetYourGuide)",
};
