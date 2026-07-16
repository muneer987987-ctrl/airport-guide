import { PrismaClient, AirportStatus, AmenityCategory, TransferType, ParkingType } from "@prisma/client";

const db = new PrismaClient();

/**
 * SEED DATA — SOURCING NOTE
 * ---------------------------------------------------------------------------
 * Geographic/identity facts (IATA/ICAO codes, coordinates, timezone, country,
 * opening year, runway/terminal counts) are well-established public facts and
 * are used directly.       Passenger-traffic figures are approximate, rounded, and
 * labeled with the year they refer to — treat them as indicative, not exact,
 * and refresh from each airport's official annual traffic report before
 * production launch (dataVerifiedAt / sourceNotes fields exist for this).
 *
 * Editorial/operational detail (exact restaurant rosters, prayer room counts,
 * live gate assignments, etc.) is NOT fabricated here. Those sections are
 * seeded with a small number of well-known, verifiable examples per airport
 * and are meant to be filled out further via /admin as content is verified —
 * that's what the admin CRUD and the Amenity/Terminal models are for.
 */

type CountrySeed = { name: string; slug: string; isoCode2: string; isoCode3: string; region: string };
type CitySeed = { name: string; slug: string; lat: number; lon: number; countrySlug: string };

const countries: CountrySeed[] = [
  { name: "United Kingdom", slug: "united-kingdom", isoCode2: "GB", isoCode3: "GBR", region: "Europe" },
  { name: "United Arab Emirates", slug: "united-arab-emirates", isoCode2: "AE", isoCode3: "ARE", region: "Middle East" },
  { name: "United States", slug: "united-states", isoCode2: "US", isoCode3: "USA", region: "North America" },
  { name: "France", slug: "france", isoCode2: "FR", isoCode3: "FRA", region: "Europe" },
  { name: "Singapore", slug: "singapore", isoCode2: "SG", isoCode3: "SGP", region: "Asia" },
  { name: "Japan", slug: "japan", isoCode2: "JP", isoCode3: "JPN", region: "Asia" },
  { name: "Turkey", slug: "turkey", isoCode2: "TR", isoCode3: "TUR", region: "Europe" },
  { name: "Qatar", slug: "qatar", isoCode2: "QA", isoCode3: "QAT", region: "Middle East" },
];

const cities: CitySeed[] = [
  { name: "London", slug: "london", lat: 51.5072, lon: -0.1276, countrySlug: "united-kingdom" },
  { name: "Dubai", slug: "dubai", lat: 25.2048, lon: 55.2708, countrySlug: "united-arab-emirates" },
  { name: "New York", slug: "new-york", lat: 40.7128, lon: -74.006, countrySlug: "united-states" },
  { name: "Paris", slug: "paris", lat: 48.8566, lon: 2.3522, countrySlug: "france" },
  { name: "Singapore", slug: "singapore-city", lat: 1.3521, lon: 103.8198, countrySlug: "singapore" },
  { name: "Tokyo", slug: "tokyo", lat: 35.6762, lon: 139.6503, countrySlug: "japan" },
  { name: "Istanbul", slug: "istanbul", lat: 41.0082, lon: 28.9784, countrySlug: "turkey" },
  { name: "Doha", slug: "doha", lat: 25.2854, lon: 51.531, countrySlug: "qatar" },
];

const airports = [
  {
    slug: "london-heathrow-lhr",
    name: "London Heathrow Airport",
    iata: "LHR",
    icao: "EGLL",
    citySlug: "london",
    countrySlug: "united-kingdom",
    latitude: 51.47,
    longitude: -0.4543,
    elevationFt: 83,
    timezone: "Europe/London",
    openedYear: 1946,
    runwayCount: 2,
    terminalCount: 4,
    annualPassengers: 83_900_000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.heathrow.com",
    overview:
      "Heathrow is the United Kingdom's busiest airport and one of the world's key long-haul hubs, sitting roughly 14 miles west of central London. It operates four passenger terminals — 2, 3, 4, and 5 — across two parallel runways, and serves as the primary base for British Airways and a major hub for Virgin Atlantic and Star Alliance and Oneworld partner carriers.",
    terminals: [
      { code: "Terminal 2", description: "Known as 'The Queen's Terminal', home to Star Alliance carriers including United, Air Canada, and Lufthansa." },
      { code: "Terminal 3", description: "Hosts Virgin Atlantic, Delta, and several Oneworld and SkyTeam partners." },
      { code: "Terminal 4", description: "Primarily used by SkyTeam carriers and some Oneworld flights." },
      { code: "Terminal 5", description: "Dedicated to British Airways and Iberia, Heathrow's largest and newest terminal." },
    ],
  },
  {
    slug: "dubai-international-dxb",
    name: "Dubai International Airport",
    iata: "DXB",
    icao: "OMDB",
    citySlug: "dubai",
    countrySlug: "united-arab-emirates",
    latitude: 25.2532,
    longitude: 55.3657,
    elevationFt: 62,
    timezone: "Asia/Dubai",
    openedYear: 1960,
    runwayCount: 2,
    terminalCount: 3,
    annualPassengers: 92_300_000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.dubaiairports.ae",
    overview:
      "Dubai International is the primary hub for Emirates and a major connecting point between Europe, Asia, Africa, and Australia. It has ranked among the world's busiest airports by international passenger traffic for over a decade, and its Terminal 3 is one of the largest airport buildings on earth.",
    terminals: [
      { code: "Terminal 1", description: "Serves a range of international carriers on Concourses C and D." },
      { code: "Terminal 2", description: "Primarily used by flydubai and other regional carriers." },
      { code: "Terminal 3", description: "Dedicated exclusively to Emirates, including Concourse A for the A380 fleet." },
    ],
   lounges: [
      {
        name: "Marhaba Lounge",
        terminal: "Terminal 1",
        operator: "Marhaba (dnata)",
        accessRules: "Pay-per-use, or free entry with Priority Pass / DragonPass membership.",
        amenities: "Hot and cold international buffet, full bar including alcohol, shower facilities, prayer room, kids area.",
      },
      {
        name: "Marhaba Lounge",
        terminal: "Terminal 3, Concourse B",
        operator: "Marhaba (dnata)",
        accessRules: "Pay-per-use, or free entry with Priority Pass / DragonPass membership.",
        amenities: "Extensive hot buffet refreshed every 2-3 hours, private bookable shower suites, sleeping pods, family zone, spa treatments available for a separate charge.",
      },
      {
        name: "Emirates Business Class Lounge",
        terminal: "Terminal 3, Concourse B",
        operator: "Emirates",
        accessRules: "Emirates Business Class ticket or Emirates Skywards elite tier required.",
        amenities: "Nearly 10,000 sq ft of space, dedicated dining area, rarely overcrowded.",
      },
      {
        name: "Ahlan Lounge",
        terminal: "Terminal 1",
        operator: "Dubai International Hotel",
        accessRules: "Paid entry from approximately $60, or free with Priority Pass / DragonPass.",
        amenities: "Accommodates up to 177 guests, open 24 hours, business and first class sections available.",
      },
      {
        name: "Sleepover Rest Cabins",
        terminal: "Multiple (T1 D-Gates, T3 A/B/C-Gates)",
        operator: "Sleepover (formerly Sleep'n Fly)",
        accessRules: "Paid, booked by the hour, from approximately $35-40.",
        amenities: "Private and semi-private cabins with lie-flat beds, USB ports, power sockets, open 24/7.",
      },
    ],
    hotels: [
      { name: "Dubai International Hotel", distanceKm: 0, shuttleFree: true, starRating: 5 },
      { name: "Le Méridien Dubai Hotel & Conference Centre", distanceKm: 3, shuttleFree: true, starRating: 4 },
      { name: "Premier Inn Dubai International Airport", distanceKm: 2, shuttleFree: true, starRating: 3 },
      { name: "Millennium Airport Hotel Dubai", distanceKm: 4, shuttleFree: true, starRating: 4 },
      { name: "Holiday Inn Express Dubai Airport", distanceKm: 1, shuttleFree: true, starRating: 3 },
    ],
    tips: [
      { tip: "Terminal 3 handles all Emirates and flydubai flights...", sortOrder: 0 },
    
      { tip: "If you're arriving very late at night...", sortOrder: 5 },
    ],
  },
  {
    slug: "new-york-jfk",
    name: "John F. Kennedy International Airport",
    iata: "JFK",
    icao: "KJFK",
    citySlug: "new-york",
    countrySlug: "united-states",
    latitude: 40.6413,
    longitude: -73.7781,
    elevationFt: 13,
    timezone: "America/New_York",
    openedYear: 1948,
    runwayCount: 4,
    terminalCount: 6,
    annualPassengers: 62_500_000,
    annualPassengersYear: 2023,
    websiteUrl: "https://www.jfkairport.com",
    overview:
      "JFK is New York City's primary international gateway, located in Queens on Jamaica Bay. It's the leading U.S. gateway for international air travel and a hub for Delta, JetBlue, and American Airlines, with a major terminal redevelopment programme reshaping Terminals 1, 6, and 8 through the late 2020s.",
    terminals: [
      { code: "Terminal 4", description: "Operated by JFKIAT; home to Delta's international operations and many Star Alliance/SkyTeam partners." },
      { code: "Terminal 5", description: "JetBlue's dedicated terminal, the airport's largest by gate count." },
      { code: "Terminal 7", description: "Used by British Airways and other Oneworld carriers." },
      { code: "Terminal 8", description: "American Airlines' hub terminal, shared with several Oneworld partners." },
    ],
  },
  {
    slug: "paris-charles-de-gaulle-cdg",
    name: "Paris Charles de Gaulle Airport",
    iata: "CDG",
    icao: "LFPG",
    citySlug: "paris",
    countrySlug: "france",
    latitude: 49.0097,
    longitude: 2.5479,
    elevationFt: 392,
    timezone: "Europe/Paris",
    openedYear: 1974,
    runwayCount: 4,
    terminalCount: 3,
    annualPassengers: 70_400_000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.parisaeroport.fr",
    overview:
      "Charles de Gaulle is France's largest airport and the principal hub for Air France and the SkyTeam alliance, located about 16 miles northeast of Paris. Its terminal complex spans three main terminals, with Terminal 1's distinctive circular design and Terminal 2's multiple halls (2A–2G) among Europe's most recognizable airport architecture.",
    terminals: [
      { code: "Terminal 1", description: "A circular 1970s-designed terminal used by Star Alliance and other international carriers." },
      { code: "Terminal 2", description: "Air France's home terminal, split into halls 2A through 2G." },
      { code: "Terminal 3", description: "Primarily serves low-cost and charter carriers." },
    ],
  },
  {
    slug: "singapore-changi-sin",
    name: "Singapore Changi Airport",
    iata: "SIN",
    icao: "WSSS",
    citySlug: "singapore-city",
    countrySlug: "singapore",
    latitude: 1.3644,
    longitude: 103.9915,
    elevationFt: 22,
    timezone: "Asia/Singapore",
    openedYear: 1981,
    runwayCount: 3,
    terminalCount: 4,
    annualPassengers: 67_700_000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.changiairport.com",
    overview:
      "Changi Airport is Singapore Airlines' home hub and a perennial award-winner for passenger experience, anchored by the Jewel Changi Airport complex with its indoor waterfall. Four terminals connect via the Changi Airport Skytrain, and a fifth terminal is under construction to further expand capacity.",
    terminals: [
      { code: "Terminal 1", description: "Home to Singapore Airlines regional flights and several international carriers." },
      { code: "Terminal 2", description: "Connected to Terminal 1 via Skytrain; hosts SIA and Star Alliance partners." },
      { code: "Terminal 3", description: "Singapore Airlines' primary long-haul terminal, directly linked to Jewel Changi." },
      { code: "Terminal 4", description: "A boutique terminal with self-service check-in and fast-track immigration." },
    ],
  },
  {
    slug: "tokyo-haneda-hnd",
    name: "Tokyo Haneda Airport",
    iata: "HND",
    icao: "RJTT",
    citySlug: "tokyo",
    countrySlug: "japan",
    latitude: 35.5494,
    longitude: 139.7798,
    elevationFt: 21,
    timezone: "Asia/Tokyo",
    openedYear: 1931,
    runwayCount: 4,
    terminalCount: 3,
    annualPassengers: 85_800_000,
    annualPassengersYear: 2023,
    websiteUrl: "https://tokyo-haneda.com",
    overview:
      "Haneda is Tokyo's closer-in airport, roughly 20 minutes from central Tokyo by train, and one of the world's busiest airports by domestic traffic. It's the primary base for Japan Airlines and All Nippon Airways, with Terminal 3 handling most international flights.",
    terminals: [
      { code: "Terminal 1", description: "Domestic terminal primarily used by Japan Airlines and JAL Group carriers." },
      { code: "Terminal 2", description: "Domestic terminal primarily used by All Nippon Airways and Star Alliance domestic partners." },
      { code: "Terminal 3", description: "International terminal serving all foreign carriers and international ANA/JAL flights." },
    ],
  },
  {
    slug: "istanbul-airport-ist",
    name: "Istanbul Airport",
    iata: "IST",
    icao: "LTFM",
    citySlug: "istanbul",
    countrySlug: "turkey",
    latitude: 41.2753,
    longitude: 28.7519,
    elevationFt: 325,
    timezone: "Europe/Istanbul",
    openedYear: 2018,
    runwayCount: 3,
    terminalCount: 1,
    annualPassengers: 80_000_000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.istairport.com",
    overview:
      "Istanbul Airport opened in 2018 to replace Atatürk Airport as Turkish Airlines' primary hub, and is designed to eventually handle well over 150 million passengers a year across a single vast terminal building. Its location bridges Europe and Asia, making it one of the most significant connecting hubs for long-haul east-west travel.",
    terminals: [
      { code: "Main Terminal", description: "A single unified terminal building organized into international and domestic zones, one of the largest airport terminals in the world under one roof." },
    ],
  },
  {
    slug: "doha-hamad-international-doh",
    name: "Hamad International Airport",
    iata: "DOH",
    icao: "OTHH",
    citySlug: "doha",
    countrySlug: "qatar",
    latitude: 25.2731,
    longitude: 51.6081,
    elevationFt: 13,
    timezone: "Asia/Qatar",
    openedYear: 2014,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 52_700_000,
    annualPassengersYear: 2024,
    websiteUrl: "https://dohahamadairport.com",
    overview:
      "Hamad International is Qatar Airways' hub and one of the Gulf's principal long-haul connecting airports, known for The Orchard indoor garden and large-scale public art installations including the giant yellow 'Lamp Bear'. It opened in 2014 to replace Doha International Airport.",
    terminals: [
      { code: "Passenger Terminal Complex", description: "A single integrated terminal with concourses A, B, C, D, and E serving all carriers." },
    ],
  },
];

async function main() {
  console.log("Seeding countries...");
  const countryRecords = new Map<string, string>();
  for (const c of countries) {
    const rec = await db.country.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    countryRecords.set(c.slug, rec.id);
  }

  console.log("Seeding cities...");
  const cityRecords = new Map<string, string>();
  for (const c of cities) {
    const countryId = countryRecords.get(c.countrySlug)!;
    const rec = await db.city.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        latitude: c.lat,
        longitude: c.lon,
        countryId,
      },
    });
    cityRecords.set(c.slug, rec.id);
  }

  console.log("Seeding airports...");
  for (const a of airports) {
    const cityId = cityRecords.get(a.citySlug)!;
    const countryId = countryRecords.get(a.countrySlug)!;

    const airport = await db.airport.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        name: a.name,
        iata: a.iata,
        icao: a.icao,
        cityId,
        countryId,
        latitude: a.latitude,
        longitude: a.longitude,
        elevationFt: a.elevationFt,
        timezone: a.timezone,
        overview: a.overview,
        openedYear: a.openedYear,
        runwayCount: a.runwayCount,
        terminalCount: a.terminalCount,
        annualPassengers: a.annualPassengers,
        annualPassengersYear: a.annualPassengersYear,
        websiteUrl: a.websiteUrl,
        status: AirportStatus.PUBLISHED,
        sourceNotes:
          "Core identity facts (codes, coordinates, timezone, runway/terminal counts) compiled from public airport-operator and aviation-reference data. Passenger totals are rounded approximations for the stated year — confirm against the airport's official annual traffic report before relying on exact figures.",
      },
    });

    for (const t of a.terminals) {
      await db.terminal.upsert({
        where: { airportId_code: { airportId: airport.id, code: t.code } },
        update: {},
        create: {
          airportId: airport.id,
          code: t.code,
          description: t.description,
        },
      });
    }

    // A representative starter set of amenities per airport — not exhaustive.
    // Extend via /admin as each location is verified.
    const starterAmenities: { category: AmenityCategory; name: string; location?: string }[] = [
      { category: AmenityCategory.CURRENCY_EXCHANGE, name: "Currency exchange counter", location: "Landside arrivals hall" },
      { category: AmenityCategory.FREE_WIFI, name: "Free airport WiFi", location: "Terminal-wide" },
      { category: AmenityCategory.PHARMACY, name: "Airport pharmacy", location: "Departures hall" },
      { category: AmenityCategory.CHARGING_STATION, name: "Charging stations", location: "Gate seating areas" },
    ];
    for (const am of starterAmenities) {
      await db.amenity.create({
        data: { airportId: airport.id, ...am },
      });
    }

    // Ground transport — generic categories seeded; specifics belong in admin.
    const transferSeeds: { type: TransferType; provider?: string; description: string }[] = [
      { type: TransferType.TAXI, description: "Metered airport taxis available at designated ranks outside arrivals." },
      { type: TransferType.METRO, description: "Rail/metro connection into the city center — check current line and schedule." },
      { type: TransferType.CAR_RENTAL, description: "Major car rental counters located in or near the terminal." },
    ];
    for (const tr of transferSeeds) {
      await db.transferOption.create({ data: { airportId: airport.id, ...tr } });
    }

    const parkingSeeds: { type: ParkingType; name: string }[] = [
      { type: ParkingType.SHORT_STAY, name: "Short-stay terminal parking" },
      { type: ParkingType.LONG_STAY, name: "Long-stay / economy parking" },
    ];
    for (const p of parkingSeeds) {
      await db.parkingOption.create({ data: { airportId: airport.id, ...p } });
    }

    // Baseline FAQ — generic but genuinely useful, extend per airport in admin.
    await db.fAQ.createMany({
      data: [
        {
          airportId: airport.id,
          question: `What are the IATA and ICAO codes for ${a.name}?`,
          answer: `${a.name} uses the IATA code ${a.iata} and the ICAO code ${a.icao}.`,
          sortOrder: 0,
        },
        {
          airportId: airport.id,
          question: `What time zone is ${a.name} in?`,
          answer: `${a.name} operates on ${a.timezone} time.`,
          sortOrder: 1,
        },
      ],
    });
  }

  console.log("Seeding landing pages...");
  const landingPages = [
    { slug: "airport-parking", title: "Airport Parking Guide", bodyContent: "Compare short-stay, long-stay, and valet parking options at major airports worldwide." },
    { slug: "airport-hotels", title: "Airport Hotels Guide", bodyContent: "Find hotels near major airports, from airside capsule hotels to shuttle-connected properties." },
    { slug: "airport-taxi", title: "Airport Taxi Guide", bodyContent: "Understand metered taxi ranks, rideshare pickup zones, and fixed-fare options at major airports." },
    { slug: "airport-metro", title: "Airport Metro & Train Guide", bodyContent: "Rail and metro connections between major airports and city centers." },
    { slug: "airport-lounges", title: "Airport Lounges Guide", bodyContent: "Lounge access options by airport, from Priority Pass to airline-branded lounges." },
    { slug: "airport-maps", title: "Airport Maps", bodyContent: "Interactive terminal and airport-wide maps." },
    { slug: "airport-weather", title: "Airport Weather", bodyContent: "Live conditions at major airports worldwide." },
    { slug: "airport-transfers", title: "Airport Transfers Guide", bodyContent: "Private transfers, shuttles, and shared-ride options to and from major airports." },
    { slug: "airport-flight-status", title: "Live Flight Status", bodyContent: "Real-time arrivals and departures at major airports." },
    { slug: "airport-currency-exchange", title: "Airport Currency Exchange", bodyContent: "Where to exchange currency at major airports, and how to avoid poor rates." },
    { slug: "airport-faqs", title: "Airport FAQs", bodyContent: "Answers to the most common questions travelers have about major airports." },
  ];
  for (const lp of landingPages) {
    await db.landingPage.upsert({ where: { slug: lp.slug }, update: {}, create: lp });
  }

  console.log("Seeding affiliate network placeholders (disabled until real IDs are set)...");
  const networks = [
    "TRAVELPAYOUTS", "AIRALO", "DISCOVER_CARS", "SAFETYWING", "VISITORS_COVERAGE",
    "WELCOME_PICKUPS", "JAYRIDE", "KIWITAXI", "HOLIDAY_TAXIS", "BOOKING_COM", "VIATOR", "GET_YOUR_GUIDE",
  ] as const;
  for (const network of networks) {
    await db.affiliateConfig.upsert({
      where: { network },
      update: {},
      create: { network, isEnabled: false },
    });
  }

  console.log("Seeding ad placement placeholders (disabled until AdSense unit IDs are set)...");
  const slots = ["HEADER", "IN_CONTENT", "SIDEBAR", "FOOTER", "MOBILE_STICKY"] as const;
  for (const slot of slots) {
    await db.adPlacement.upsert({ where: { slot }, update: {}, create: { slot, isEnabled: false } });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
