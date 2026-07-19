import { PrismaClient } from "@prisma/client";
 
const db = new PrismaClient();
 
/**
 * Adds terminal entries for the 17 airports that had none. Descriptions
 * are kept general/safe where airline-terminal assignments are subject to
 * change (e.g. Riyadh's 2026 terminal reorganization) rather than stating
 * specifics that could go stale quickly. Idempotent — safe to re-run.
 */
 
const terminals: Record<string, { code: string; description: string }[]> = {
  "karachi-jinnah-khi": [
    { code: "Terminal 1", description: "Handles domestic flights." },
    { code: "Terminal 2 (Jinnah Terminal)", description: "Handles international flights and is the airport's main international gateway." },
  ],
  "lahore-allama-iqbal-lhe": [
    { code: "Domestic Terminal", description: "Handles all domestic flights within Pakistan." },
    { code: "International Terminal", description: "Handles all international departures and arrivals." },
  ],
  "islamabad-international-isb": [
    { code: "Main Terminal", description: "A single modern terminal opened in 2018, handling both domestic and international flights." },
  ],
  "riyadh-king-khalid-ruh": [
    { code: "Terminal 1", description: "Serves international flights; terminal assignments at Riyadh airport have been undergoing reorganization since early 2026, so confirm your terminal on your boarding pass before traveling." },
    { code: "Terminal 3", description: "Serves international flights." },
    { code: "Terminal 4", description: "Used primarily by Saudia for international routes." },
    { code: "Terminal 5", description: "Handles domestic flights, including Saudia and Flynas." },
  ],
  "jeddah-king-abdulaziz-jed": [
    { code: "Terminal 1", description: "A single unified terminal handling both domestic and international flights, including a dedicated Hajj Terminal for pilgrim traffic during the annual Hajj season." },
  ],
  "muscat-international-mct": [
    { code: "Main Terminal", description: "A single terminal redeveloped and expanded in 2018, handling both domestic and international flights." },
  ],
  "kuwait-international-kwi": [
    { code: "Terminal 1", description: "The original main terminal, handling a mix of domestic and international flights." },
    { code: "Terminal 4", description: "A newer terminal building serving select international carriers." },
  ],
  "amsterdam-schiphol-ams": [
    { code: "Terminal (Departure Halls 1-3)", description: "Schiphol operates as a single large terminal building organized into three connected departure halls rather than separate numbered terminals." },
  ],
  "frankfurt-fra": [
    { code: "Terminal 1", description: "The original and larger terminal, primarily used by Lufthansa and Star Alliance partners." },
    { code: "Terminal 2", description: "Used by a mix of international carriers, connected to Terminal 1 via Skyline shuttle." },
  ],
  "madrid-barajas-mad": [
    { code: "Terminal 1", description: "Serves a range of international carriers." },
    { code: "Terminal 2", description: "Primarily serves SkyTeam alliance carriers." },
    { code: "Terminal 3", description: "Used for select flights, connected to the T1-T2-T3 complex." },
    { code: "Terminal 4 / 4S", description: "Iberia's home terminal, known for its award-winning architecture and bamboo ceilings." },
  ],
  "rome-fiumicino-fco": [
    { code: "Terminal 1", description: "Serves a mix of international carriers." },
    { code: "Terminal 3", description: "The main hub terminal for ITA Airways and Lufthansa Group partners." },
  ],
  "toronto-pearson-yyz": [
    { code: "Terminal 1", description: "Air Canada's home terminal and hub for Star Alliance partners." },
    { code: "Terminal 3", description: "Used by a range of international and low-cost carriers." },
  ],
  "sydney-kingsford-smith-syd": [
    { code: "T1 International", description: "Handles all international flights." },
    { code: "T2 Domestic", description: "Used by Jetstar, Virgin Australia, and other domestic carriers." },
    { code: "T3 Domestic", description: "Qantas's domestic terminal." },
  ],
  "bangkok-suvarnabhumi-bkk": [
    { code: "Main Terminal", description: "A single large terminal building handling both domestic and international flights, organized into multiple concourses." },
  ],
  "kuala-lumpur-international-kul": [
    { code: "KLIA (Main Terminal)", description: "The original main terminal, home to Malaysia Airlines and full-service international carriers." },
    { code: "klia2", description: "A dedicated terminal for AirAsia and other low-cost carriers, connected to the main terminal by rail." },
  ],
  "hong-kong-international-hkg": [
    { code: "Terminal 1", description: "The main terminal, home to Cathay Pacific and the majority of international carriers." },
    { code: "Terminal 2", description: "Primarily used for check-in and passenger services, connected to Terminal 1's boarding gates." },
  ],
  "delhi-indira-gandhi-del": [
    { code: "Terminal 1", description: "Handles domestic flights for IndiGo and other domestic carriers." },
    { code: "Terminal 2", description: "Used for select domestic and international flights." },
    { code: "Terminal 3", description: "The main international terminal and hub for Air India." },
  ],
};
 
async function main() {
  for (const [slug, items] of Object.entries(terminals)) {
    const airport = await db.airport.findUnique({ where: { slug } });
    if (!airport) {
      console.log(`Skipping (not found): ${slug}`);
      continue;
    }
    for (const t of items) {
      const exists = await db.terminal.findFirst({ where: { airportId: airport.id, code: t.code } });
      if (!exists) {
        await db.terminal.create({ data: { airportId: airport.id, ...t } });
      }
    }
    console.log(`Terminals done: ${airport.name}`);
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