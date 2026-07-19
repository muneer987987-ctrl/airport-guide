import { PrismaClient } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Unique, keyword-relevant meta titles and descriptions per airport.
 * Idempotent — safe to re-run (always overwrites with the latest copy).
 */
 
const seo: Record<string, { metaTitle: string; metaDescription: string }> = {
  "london-heathrow-lhr": { metaTitle: "London Heathrow Airport (LHR) Guide 2026 — Terminals, Transfers & Lounges", metaDescription: "Complete Heathrow Airport guide: Terminal 2-5 maps, Heathrow Express, parking, lounges, live flight status, and tips for a smooth trip through LHR." },
  "dubai-international-dxb": { metaTitle: "Dubai International Airport (DXB) Guide 2026 — Terminals, Metro & Lounges", metaDescription: "Everything you need for DXB: Terminal 1-3 guide, Dubai Metro connections, Emirates lounges, duty free, parking, and live flight status." },
  "new-york-jfk": { metaTitle: "JFK Airport (New York) Guide 2026 — Terminals, AirTrain & Transfers", metaDescription: "Navigate JFK International Airport with our terminal-by-terminal guide, AirTrain and taxi info, lounges, parking, and live arrivals & departures." },
  "paris-charles-de-gaulle-cdg": { metaTitle: "Paris CDG Airport Guide 2026 — Terminals, RER & Lounges", metaDescription: "Charles de Gaulle Airport guide: Terminal 1-3 layout, RER B train to Paris, Air France lounges, parking, and live flight status for CDG." },
  "singapore-changi-sin": { metaTitle: "Singapore Changi Airport (SIN) Guide 2026 — Jewel, Terminals & Lounges", metaDescription: "Changi Airport guide covering Terminal 1-4, Jewel Changi, Skytrain, SilverKris lounges, transfers, and live flight status for SIN." },
  "tokyo-haneda-hnd": { metaTitle: "Tokyo Haneda Airport (HND) Guide 2026 — Terminals, Trains & Lounges", metaDescription: "Haneda Airport guide: domestic and international terminal layout, Tokyo Monorail and Keikyu Line access, JAL/ANA lounges, and live flight status." },
  "istanbul-airport-ist": { metaTitle: "Istanbul Airport (IST) Guide 2026 — Terminal, Metro & Turkish Airlines Lounge", metaDescription: "Istanbul Airport guide: single-terminal layout, metro and transfer options, the famous Turkish Airlines CIP Lounge, and live flight status for IST." },
  "doha-hamad-international-doh": { metaTitle: "Hamad International Airport Doha (DOH) Guide 2026 — Terminals & Al Mourjan Lounge", metaDescription: "Doha Hamad Airport guide covering The Orchard, Al Mourjan Business Lounge, transfers, duty free, and live flight status for DOH." },
  "karachi-jinnah-khi": { metaTitle: "Karachi Jinnah International Airport (KHI) Guide 2026 — Terminals & Transfers", metaDescription: "Jinnah International Airport Karachi guide: Terminal 1-2 layout, taxi and transfer options, lounges, parking, and live flight status for KHI." },
  "lahore-allama-iqbal-lhe": { metaTitle: "Lahore Allama Iqbal Airport (LHE) Guide 2026 — Terminals & Transfers", metaDescription: "Allama Iqbal International Airport Lahore guide: domestic and international terminal info, transfers, lounges, and live flight status for LHE." },
  "islamabad-international-isb": { metaTitle: "Islamabad International Airport (ISB) Guide 2026 — Terminal & Transfers", metaDescription: "Islamabad International Airport guide: terminal layout, taxi and transfer options, lounges, parking, and live flight status for ISB." },
  "riyadh-king-khalid-ruh": { metaTitle: "Riyadh King Khalid Airport (RUH) Guide 2026 — Terminals & Alfursan Lounge", metaDescription: "King Khalid International Airport Riyadh guide: T1-T5 layout, Alfursan Lounge, metro and transfer options, and live flight status for RUH." },
  "jeddah-king-abdulaziz-jed": { metaTitle: "Jeddah King Abdulaziz Airport (JED) Guide 2026 — Terminal & Transfers", metaDescription: "King Abdulaziz International Airport Jeddah guide: terminal layout, Hajj Terminal info, lounges, transfers, and live flight status for JED." },
  "muscat-international-mct": { metaTitle: "Muscat International Airport (MCT) Guide 2026 — Terminal & Transfers", metaDescription: "Muscat International Airport guide: terminal layout, Oman Air hub info, lounges, transfers, and live flight status for MCT." },
  "kuwait-international-kwi": { metaTitle: "Kuwait International Airport (KWI) Guide 2026 — Terminals & Transfers", metaDescription: "Kuwait International Airport guide: Terminal 1 and Terminal 4 layout, Kuwait Airways hub info, lounges, and live flight status for KWI." },
  "amsterdam-schiphol-ams": { metaTitle: "Amsterdam Schiphol Airport (AMS) Guide 2026 — Terminal & KLM Lounges", metaDescription: "Schiphol Airport guide: single-terminal layout, KLM Crown Lounges, train connections to Amsterdam, and live flight status for AMS." },
  "frankfurt-fra": { metaTitle: "Frankfurt Airport (FRA) Guide 2026 — Terminals & Lufthansa Lounges", metaDescription: "Frankfurt Airport guide: Terminal 1-2 layout, Lufthansa Senator and First Class lounges, train connections, and live flight status for FRA." },
  "madrid-barajas-mad": { metaTitle: "Madrid Barajas Airport (MAD) Guide 2026 — Terminals & Iberia Lounges", metaDescription: "Madrid–Barajas Airport guide: T1-T4S layout, Iberia lounges, metro connections to Madrid, and live flight status for MAD." },
  "rome-fiumicino-fco": { metaTitle: "Rome Fiumicino Airport (FCO) Guide 2026 — Terminals & ITA Airways Lounges", metaDescription: "Rome Fiumicino Airport guide: Terminal 1 and 3 layout, ITA Airways lounges, Leonardo Express train, and live flight status for FCO." },
  "toronto-pearson-yyz": { metaTitle: "Toronto Pearson Airport (YYZ) Guide 2026 — Terminals & Air Canada Lounges", metaDescription: "Toronto Pearson International Airport guide: T1 and T3 layout, Air Canada Maple Leaf Lounge, transfers, and live flight status for YYZ." },
  "sydney-kingsford-smith-syd": { metaTitle: "Sydney Airport (SYD) Guide 2026 — Terminals & Qantas Lounges", metaDescription: "Sydney Kingsford Smith Airport guide: international and domestic terminal layout, Qantas Club and First Lounge, and live flight status for SYD." },
  "bangkok-suvarnabhumi-bkk": { metaTitle: "Bangkok Suvarnabhumi Airport (BKK) Guide 2026 — Terminal & Thai Airways Lounge", metaDescription: "Suvarnabhumi Airport Bangkok guide: single-terminal layout, Royal Orchid Lounge, transfers, and live flight status for BKK." },
  "kuala-lumpur-international-kul": { metaTitle: "Kuala Lumpur Airport (KUL) Guide 2026 — KLIA, klia2 & Golden Lounge", metaDescription: "Kuala Lumpur International Airport guide: KLIA and klia2 layout, Golden Lounge, rail connections, and live flight status for KUL." },
  "hong-kong-international-hkg": { metaTitle: "Hong Kong International Airport (HKG) Guide 2026 — Terminals & Cathay Lounges", metaDescription: "Hong Kong International Airport guide: Terminal 1-2 layout, Cathay Pacific The Wing and The Pier lounges, and live flight status for HKG." },
  "delhi-indira-gandhi-del": { metaTitle: "Delhi Indira Gandhi Airport (DEL) Guide 2026 — Terminals & Maharaja Lounge", metaDescription: "Indira Gandhi International Airport Delhi guide: T1-T3 layout, Maharaja Lounge, metro connections, and live flight status for DEL." },
};
 
async function main() {
  for (const [slug, data] of Object.entries(seo)) {
    const airport = await db.airport.findUnique({ where: { slug } });
    if (!airport) {
      console.log(`Skipping (not found): ${slug}`);
      continue;
    }
    await db.airport.update({ where: { slug }, data });
    console.log(`SEO updated: ${airport.name}`);
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
