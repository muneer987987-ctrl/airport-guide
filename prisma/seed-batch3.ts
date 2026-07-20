import { PrismaClient, AirportStatus, AmenityCategory, TransferType, ParkingType } from "@prisma/client";

const db = new PrismaClient();

type CountrySeed = { name: string; slug: string; isoCode2: string; isoCode3: string; region: string };
type CitySeed = { name: string; slug: string; lat: number; lon: number; countrySlug: string };

const countries: CountrySeed[] = [
  { name: "Austria", slug: "austria", isoCode2: "AT", isoCode3: "AUT", region: "Europe" },
  { name: "Switzerland", slug: "switzerland", isoCode2: "CH", isoCode3: "CHE", region: "Europe" },
  { name: "Belgium", slug: "belgium", isoCode2: "BE", isoCode3: "BEL", region: "Europe" },
  { name: "Denmark", slug: "denmark", isoCode2: "DK", isoCode3: "DNK", region: "Europe" },
  { name: "Norway", slug: "norway", isoCode2: "NO", isoCode3: "NOR", region: "Europe" },
  { name: "Sweden", slug: "sweden", isoCode2: "SE", isoCode3: "SWE", region: "Europe" },
  { name: "Finland", slug: "finland", isoCode2: "FI", isoCode3: "FIN", region: "Europe" },
  { name: "Poland", slug: "poland", isoCode2: "PL", isoCode3: "POL", region: "Europe" },
  { name: "Czech Republic", slug: "czech-republic", isoCode2: "CZ", isoCode3: "CZE", region: "Europe" },
  { name: "Hungary", slug: "hungary", isoCode2: "HU", isoCode3: "HUN", region: "Europe" },
  { name: "Greece", slug: "greece", isoCode2: "GR", isoCode3: "GRC", region: "Europe" },
  { name: "Ireland", slug: "ireland", isoCode2: "IE", isoCode3: "IRL", region: "Europe" },
  { name: "Sri Lanka", slug: "sri-lanka", isoCode2: "LK", isoCode3: "LKA", region: "Asia" },
  { name: "Egypt", slug: "egypt", isoCode2: "EG", isoCode3: "EGY", region: "Africa" },
];

const cities: CitySeed[] = [
  { name: "Manchester", slug: "manchester", lat: 53.4808, lon: -2.2426, countrySlug: "united-kingdom" },
  { name: "Birmingham", slug: "birmingham", lat: 52.4862, lon: -1.8904, countrySlug: "united-kingdom" },
  { name: "Munich", slug: "munich", lat: 48.1351, lon: 11.582, countrySlug: "germany" },
  { name: "Vienna", slug: "vienna", lat: 48.2082, lon: 16.3738, countrySlug: "austria" },
  { name: "Zurich", slug: "zurich", lat: 47.3769, lon: 8.5417, countrySlug: "switzerland" },
  { name: "Brussels", slug: "brussels", lat: 50.8503, lon: 4.3517, countrySlug: "belgium" },
  { name: "Copenhagen", slug: "copenhagen", lat: 55.6761, lon: 12.5683, countrySlug: "denmark" },
  { name: "Oslo", slug: "oslo", lat: 59.9139, lon: 10.7522, countrySlug: "norway" },
  { name: "Stockholm", slug: "stockholm", lat: 59.3293, lon: 18.0686, countrySlug: "sweden" },
  { name: "Helsinki", slug: "helsinki", lat: 60.1699, lon: 24.9384, countrySlug: "finland" },
  { name: "Warsaw", slug: "warsaw", lat: 52.2297, lon: 21.0122, countrySlug: "poland" },
  { name: "Prague", slug: "prague", lat: 50.0755, lon: 14.4378, countrySlug: "czech-republic" },
  { name: "Budapest", slug: "budapest", lat: 47.4979, lon: 19.0402, countrySlug: "hungary" },
  { name: "Athens", slug: "athens", lat: 37.9838, lon: 23.7275, countrySlug: "greece" },
  { name: "Dublin", slug: "dublin", lat: 53.3498, lon: -6.2603, countrySlug: "ireland" },
  { name: "Abu Dhabi", slug: "abu-dhabi", lat: 24.4539, lon: 54.3773, countrySlug: "united-arab-emirates" },
  { name: "Colombo", slug: "colombo", lat: 6.9271, lon: 79.8612, countrySlug: "sri-lanka" },
  { name: "Mumbai", slug: "mumbai", lat: 19.076, lon: 72.8777, countrySlug: "india" },
  { name: "Bengaluru", slug: "bengaluru", lat: 12.9716, lon: 77.5946, countrySlug: "india" },
  { name: "Chicago", slug: "chicago", lat: 41.8781, lon: -87.6298, countrySlug: "united-states" },
  { name: "Los Angeles", slug: "los-angeles", lat: 34.0522, lon: -118.2437, countrySlug: "united-states" },
  { name: "Vancouver", slug: "vancouver", lat: 49.2827, lon: -123.1207, countrySlug: "canada" },
  { name: "Melbourne", slug: "melbourne", lat: -37.8136, lon: 144.9631, countrySlug: "australia" },
  { name: "Tokyo Narita", slug: "tokyo-narita", lat: 35.6762, lon: 139.6503, countrySlug: "japan" },
  { name: "Cairo", slug: "cairo", lat: 30.0444, lon: 31.2357, countrySlug: "egypt" },
];

const airports = [
  { slug: "manchester-airport-man", name: "Manchester Airport", iata: "MAN", icao: "EGCC", citySlug: "manchester", countrySlug: "united-kingdom", latitude: 53.3537, longitude: -2.275, elevationFt: 257, timezone: "Europe/London", openedYear: 1938, runwayCount: 2, terminalCount: 2, annualPassengers: 28100000, annualPassengersYear: 2023, websiteUrl: "https://www.manchesterairport.co.uk", overview: "Manchester Airport is the largest airport in the UK outside London, serving as a major gateway to the North of England with direct long-haul connections across the globe." },
  { slug: "birmingham-airport-bhx", name: "Birmingham Airport", iata: "BHX", icao: "EGBB", citySlug: "birmingham", countrySlug: "united-kingdom", latitude: 52.4539, longitude: -1.748, elevationFt: 327, timezone: "Europe/London", openedYear: 1939, runwayCount: 1, terminalCount: 1, annualPassengers: 12400000, annualPassengersYear: 2023, websiteUrl: "https://www.birminghamairport.co.uk", overview: "Birmingham Airport serves the English Midlands with a single, compact terminal handling both short-haul and long-haul routes." },
  { slug: "munich-airport-muc", name: "Munich Airport", iata: "MUC", icao: "EDDM", citySlug: "munich", countrySlug: "germany", latitude: 48.3538, longitude: 11.7861, elevationFt: 1487, timezone: "Europe/Berlin", openedYear: 1992, runwayCount: 2, terminalCount: 2, annualPassengers: 41100000, annualPassengersYear: 2024, websiteUrl: "https://www.munich-airport.com", overview: "Munich Airport is Germany's second-busiest airport and Lufthansa's second hub, consistently ranked among Europe's highest-quality airports." },
  { slug: "vienna-international-vie", name: "Vienna International Airport", iata: "VIE", icao: "LOWW", citySlug: "vienna", countrySlug: "austria", latitude: 48.1103, longitude: 16.5697, elevationFt: 600, timezone: "Europe/Vienna", openedYear: 1938, runwayCount: 2, terminalCount: 3, annualPassengers: 31700000, annualPassengersYear: 2024, websiteUrl: "https://www.viennaairport.com", overview: "Vienna International Airport is Austria's main airport and the hub for Austrian Airlines, serving as a key connecting point between Western Europe and Eastern Europe." },
  { slug: "zurich-airport-zrh", name: "Zurich Airport", iata: "ZRH", icao: "LSZH", citySlug: "zurich", countrySlug: "switzerland", latitude: 47.4647, longitude: 8.5492, elevationFt: 1416, timezone: "Europe/Zurich", openedYear: 1948, runwayCount: 3, terminalCount: 2, annualPassengers: 31100000, annualPassengersYear: 2024, websiteUrl: "https://www.zurich-airport.com", overview: "Zurich Airport is Switzerland's largest airport and SWISS's main hub, known for efficient connections and consistently high service ratings." },
  { slug: "brussels-airport-bru", name: "Brussels Airport", iata: "BRU", icao: "EBBR", citySlug: "brussels", countrySlug: "belgium", latitude: 50.901, longitude: 4.4844, elevationFt: 184, timezone: "Europe/Brussels", openedYear: 1958, runwayCount: 3, terminalCount: 1, annualPassengers: 22400000, annualPassengersYear: 2024, websiteUrl: "https://www.brusselsairport.be", overview: "Brussels Airport is Belgium's main airport, located in Zaventem, and serves as the hub for Brussels Airlines." },
  { slug: "copenhagen-airport-cph", name: "Copenhagen Airport", iata: "CPH", icao: "EKCH", citySlug: "copenhagen", countrySlug: "denmark", latitude: 55.618, longitude: 12.656, elevationFt: 17, timezone: "Europe/Copenhagen", openedYear: 1925, runwayCount: 3, terminalCount: 3, annualPassengers: 30200000, annualPassengersYear: 2024, websiteUrl: "https://www.cph.dk", overview: "Copenhagen Airport is the largest airport in Scandinavia and a hub for SAS, serving as the main gateway to Denmark." },
  { slug: "oslo-airport-osl", name: "Oslo Airport", iata: "OSL", icao: "ENGM", citySlug: "oslo", countrySlug: "norway", latitude: 60.1939, longitude: 11.1004, elevationFt: 681, timezone: "Europe/Oslo", openedYear: 1998, runwayCount: 2, terminalCount: 1, annualPassengers: 28500000, annualPassengersYear: 2024, websiteUrl: "https://avinor.no/en/airport/oslo-airport", overview: "Oslo Airport, also known as Gardermoen, is Norway's main airport and a hub for both SAS and Norwegian." },
  { slug: "stockholm-arlanda-arn", name: "Stockholm Arlanda Airport", iata: "ARN", icao: "ESSA", citySlug: "stockholm", countrySlug: "sweden", latitude: 59.6519, longitude: 17.9186, elevationFt: 137, timezone: "Europe/Stockholm", openedYear: 1959, runwayCount: 3, terminalCount: 3, annualPassengers: 24100000, annualPassengersYear: 2024, websiteUrl: "https://www.swedavia.com/arlanda", overview: "Stockholm Arlanda is Sweden's largest airport and the main hub for SAS, located roughly 40km north of central Stockholm." },
  { slug: "helsinki-airport-hel", name: "Helsinki Airport", iata: "HEL", icao: "EFHK", citySlug: "helsinki", countrySlug: "finland", latitude: 60.3172, longitude: 24.9633, elevationFt: 179, timezone: "Europe/Helsinki", openedYear: 1952, runwayCount: 3, terminalCount: 2, annualPassengers: 15300000, annualPassengersYear: 2024, websiteUrl: "https://www.finavia.fi/en/airports/helsinki-airport", overview: "Helsinki Airport is Finland's main airport and Finnair's hub, historically valued for short connection times on Europe-Asia routes." },
  { slug: "warsaw-chopin-waw", name: "Warsaw Chopin Airport", iata: "WAW", icao: "EPWA", citySlug: "warsaw", countrySlug: "poland", latitude: 52.1657, longitude: 20.9671, elevationFt: 362, timezone: "Europe/Warsaw", openedYear: 1934, runwayCount: 2, terminalCount: 1, annualPassengers: 19600000, annualPassengersYear: 2024, websiteUrl: "https://www.lotnisko-chopina.pl", overview: "Warsaw Chopin Airport is Poland's largest airport and the hub for LOT Polish Airlines." },
  { slug: "prague-airport-prg", name: "Vaclav Havel Airport Prague", iata: "PRG", icao: "LKPR", citySlug: "prague", countrySlug: "czech-republic", latitude: 50.1008, longitude: 14.26, elevationFt: 1247, timezone: "Europe/Prague", openedYear: 1937, runwayCount: 2, terminalCount: 2, annualPassengers: 17800000, annualPassengersYear: 2024, websiteUrl: "https://www.prg.aero", overview: "Vaclav Havel Airport Prague is the Czech Republic's main airport, serving as a key gateway for tourism into Central Europe." },
  { slug: "budapest-ferenc-liszt-bud", name: "Budapest Ferenc Liszt International Airport", iata: "BUD", icao: "LHBP", citySlug: "budapest", countrySlug: "hungary", latitude: 47.4369, longitude: 19.2556, elevationFt: 495, timezone: "Europe/Budapest", openedYear: 1950, runwayCount: 2, terminalCount: 2, annualPassengers: 16200000, annualPassengersYear: 2024, websiteUrl: "https://www.bud.hu", overview: "Budapest Ferenc Liszt International Airport is Hungary's main airport, connected via terminals 2A and 2B." },
  { slug: "athens-international-ath", name: "Athens International Airport", iata: "ATH", icao: "LGAV", citySlug: "athens", countrySlug: "greece", latitude: 37.9364, longitude: 23.9445, elevationFt: 308, timezone: "Europe/Athens", openedYear: 2001, runwayCount: 2, terminalCount: 1, annualPassengers: 28600000, annualPassengersYear: 2024, websiteUrl: "https://www.aia.gr", overview: "Athens International Airport, also known as Eleftherios Venizelos, is Greece's main airport and the hub for Aegean Airlines." },
  { slug: "dublin-airport-dub", name: "Dublin Airport", iata: "DUB", icao: "EIDW", citySlug: "dublin", countrySlug: "ireland", latitude: 53.4213, longitude: -6.2701, elevationFt: 242, timezone: "Europe/Dublin", openedYear: 1940, runwayCount: 2, terminalCount: 2, annualPassengers: 31900000, annualPassengersYear: 2024, websiteUrl: "https://www.dublinairport.com", overview: "Dublin Airport is Ireland's busiest airport and the main hub for Aer Lingus and Ryanair, serving as a key transatlantic gateway with US pre-clearance facilities." },
  { slug: "abu-dhabi-international-auh", name: "Zayed International Airport", iata: "AUH", icao: "OMAA", citySlug: "abu-dhabi", countrySlug: "united-arab-emirates", latitude: 24.433, longitude: 54.6511, elevationFt: 88, timezone: "Asia/Dubai", openedYear: 1982, runwayCount: 2, terminalCount: 1, annualPassengers: 24600000, annualPassengersYear: 2024, websiteUrl: "https://www.zayedairport.ae", overview: "Zayed International Airport (formerly Abu Dhabi International) is the hub for Etihad Airways, with a major new terminal complex opened in late 2023." },
  { slug: "colombo-bandaranaike-cmb", name: "Bandaranaike International Airport", iata: "CMB", icao: "VCBI", citySlug: "colombo", countrySlug: "sri-lanka", latitude: 7.1808, longitude: 79.8841, elevationFt: 30, timezone: "Asia/Colombo", openedYear: 1967, runwayCount: 1, terminalCount: 1, annualPassengers: 12000000, annualPassengersYear: 2023, websiteUrl: "https://www.airport.lk", overview: "Bandaranaike International Airport is Sri Lanka's main airport and the hub for SriLankan Airlines, located near Negombo." },
  { slug: "mumbai-chhatrapati-shivaji-bom", name: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM", icao: "VABB", citySlug: "mumbai", countrySlug: "india", latitude: 19.0896, longitude: 72.8656, elevationFt: 39, timezone: "Asia/Kolkata", openedYear: 1942, runwayCount: 2, terminalCount: 2, annualPassengers: 50000000, annualPassengersYear: 2024, websiteUrl: "https://www.csmia.aero", overview: "Chhatrapati Shivaji Maharaj International Airport is India's second-busiest airport and a major hub for domestic and international carriers serving Mumbai." },
  { slug: "bengaluru-kempegowda-blr", name: "Kempegowda International Airport", iata: "BLR", icao: "VOBL", citySlug: "bengaluru", countrySlug: "india", latitude: 13.1986, longitude: 77.7066, elevationFt: 3000, timezone: "Asia/Kolkata", openedYear: 2008, runwayCount: 2, terminalCount: 2, annualPassengers: 37500000, annualPassengersYear: 2024, websiteUrl: "https://www.bengaluruairport.com", overview: "Kempegowda International Airport serves Bengaluru, India's technology hub, and is one of the country's fastest-growing airports." },
  { slug: "chicago-ohare-ord", name: "O'Hare International Airport", iata: "ORD", icao: "KORD", citySlug: "chicago", countrySlug: "united-states", latitude: 41.9742, longitude: -87.9073, elevationFt: 668, timezone: "America/Chicago", openedYear: 1955, runwayCount: 7, terminalCount: 4, annualPassengers: 78000000, annualPassengersYear: 2024, websiteUrl: "https://www.flychicago.com/ohare", overview: "O'Hare International is one of the world's busiest airports and a major hub for United Airlines and American Airlines." },
  { slug: "los-angeles-international-lax", name: "Los Angeles International Airport", iata: "LAX", icao: "KLAX", citySlug: "los-angeles", countrySlug: "united-states", latitude: 33.9416, longitude: -118.4085, elevationFt: 125, timezone: "America/Los_Angeles", openedYear: 1930, runwayCount: 4, terminalCount: 9, annualPassengers: 75000000, annualPassengersYear: 2024, websiteUrl: "https://www.flylax.com", overview: "LAX is the primary international gateway to Los Angeles and one of the busiest airports in the United States, with nine passenger terminals arranged around a central horseshoe." },
  { slug: "vancouver-international-yvr", name: "Vancouver International Airport", iata: "YVR", icao: "CYVR", citySlug: "vancouver", countrySlug: "canada", latitude: 49.1967, longitude: -123.1815, elevationFt: 14, timezone: "America/Vancouver", openedYear: 1931, runwayCount: 3, terminalCount: 2, annualPassengers: 25900000, annualPassengersYear: 2024, websiteUrl: "https://www.yvr.ca", overview: "Vancouver International Airport is Canada's second-busiest airport and a major gateway between North America and Asia-Pacific." },
  { slug: "melbourne-airport-mel", name: "Melbourne Airport", iata: "MEL", icao: "YMML", citySlug: "melbourne", countrySlug: "australia", latitude: -37.6733, longitude: 144.8433, elevationFt: 434, timezone: "Australia/Melbourne", openedYear: 1970, runwayCount: 2, terminalCount: 4, annualPassengers: 35100000, annualPassengersYear: 2024, websiteUrl: "https://www.melbourneairport.com.au", overview: "Melbourne Airport, also known as Tullamarine, is Australia's second-busiest airport and the main hub for Jetstar." },
  { slug: "tokyo-narita-nrt", name: "Narita International Airport", iata: "NRT", icao: "RJAA", citySlug: "tokyo-narita", countrySlug: "japan", latitude: 35.7647, longitude: 140.3864, elevationFt: 141, timezone: "Asia/Tokyo", openedYear: 1978, runwayCount: 2, terminalCount: 3, annualPassengers: 29400000, annualPassengersYear: 2024, websiteUrl: "https://www.narita-airport.jp", overview: "Narita International Airport handles the majority of Tokyo's long-haul international traffic and is a major hub for Japan Airlines and All Nippon Airways." },
  { slug: "cairo-international-cai", name: "Cairo International Airport", iata: "CAI", icao: "HECA", citySlug: "cairo", countrySlug: "egypt", latitude: 30.1219, longitude: 31.4056, elevationFt: 382, timezone: "Africa/Cairo", openedYear: 1945, runwayCount: 3, terminalCount: 3, annualPassengers: 22000000, annualPassengersYear: 2023, websiteUrl: "https://www.cairo-airport.com", overview: "Cairo International Airport is Egypt's largest airport and the hub for EgyptAir, serving as a key gateway between Africa, Europe, and the Middle East." },
];

async function main() {
  console.log("Seeding countries...");
  const countryRecords = new Map();
  for (const c of countries) {
    const rec = await db.country.upsert({ where: { slug: c.slug }, update: {}, create: c });
    countryRecords.set(c.slug, rec.id);
  }
  const existingCountries = await db.country.findMany({ select: { id: true, slug: true } });
  for (const c of existingCountries) countryRecords.set(c.slug, c.id);

  console.log("Seeding cities...");
  const cityRecords = new Map();
  for (const c of cities) {
    const countryId = countryRecords.get(c.countrySlug);
    if (!countryId) { console.log("No country for city " + c.slug); continue; }
    const rec = await db.city.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, latitude: c.lat, longitude: c.lon, countryId },
    });
    cityRecords.set(c.slug, rec.id);
  }
  const existingCities = await db.city.findMany({ select: { id: true, slug: true } });
  for (const c of existingCities) cityRecords.set(c.slug, c.id);

  console.log("Seeding airports...");
  for (const a of airports) {
    const cityId = cityRecords.get(a.citySlug);
    const countryId = countryRecords.get(a.countrySlug);
    if (!cityId || !countryId) { console.log("Skipping " + a.slug + " - missing city/country"); continue; }

    const airport = await db.airport.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug, name: a.name, iata: a.iata, icao: a.icao, cityId, countryId,
        latitude: a.latitude, longitude: a.longitude, elevationFt: a.elevationFt, timezone: a.timezone,
        overview: a.overview, openedYear: a.openedYear, runwayCount: a.runwayCount, terminalCount: a.terminalCount,
        annualPassengers: a.annualPassengers, annualPassengersYear: a.annualPassengersYear, websiteUrl: a.websiteUrl,
        status: AirportStatus.PUBLISHED,
        sourceNotes: "Core identity facts compiled from public airport-operator and aviation-reference data. Passenger totals are rounded approximations - confirm against the airport's official annual traffic report before relying on exact figures.",
        metaTitle: a.name + " (" + a.iata + ") Guide 2026 - Terminals, Transfers & Live Flight Status",
        metaDescription: "Complete " + a.name + " guide: terminal layout, transfers, parking, lounges, and live flight status for " + a.iata + ".",
      },
    });

    for (let i = 1; i <= (a.terminalCount || 1); i++) {
      const code = a.terminalCount === 1 ? "Main Terminal" : ("Terminal " + i);
      const exists = await db.terminal.findFirst({ where: { airportId: airport.id, code } });
      if (!exists) {
        await db.terminal.create({ data: { airportId: airport.id, code } });
      }
    }

    const starterAmenities = [
      { category: AmenityCategory.CURRENCY_EXCHANGE, name: "Currency exchange counter", location: "Arrivals hall" },
      { category: AmenityCategory.FREE_WIFI, name: "Free airport WiFi", location: "Terminal-wide" },
      { category: AmenityCategory.PHARMACY, name: "Airport pharmacy", location: "Departures hall" },
      { category: AmenityCategory.CHARGING_STATION, name: "Charging stations", location: "Gate seating areas" },
    ];
    for (const am of starterAmenities) {
      const exists = await db.amenity.findFirst({ where: { airportId: airport.id, name: am.name, category: am.category } });
      if (!exists) await db.amenity.create({ data: { airportId: airport.id, ...am } });
    }

    const transferSeeds = [
      { type: TransferType.TAXI, description: "Metered airport taxis available at designated ranks outside arrivals." },
      { type: TransferType.CAR_RENTAL, description: "Major car rental counters located in or near the terminal." },
    ];
    for (const tr of transferSeeds) {
      const exists = await db.transferOption.findFirst({ where: { airportId: airport.id, type: tr.type, description: tr.description } });
      if (!exists) await db.transferOption.create({ data: { airportId: airport.id, ...tr } });
    }

    const parkingSeeds = [
      { type: ParkingType.SHORT_STAY, name: "Short-stay terminal parking" },
      { type: ParkingType.LONG_STAY, name: "Long-stay / economy parking" },
    ];
    for (const p of parkingSeeds) {
      const exists = await db.parkingOption.findFirst({ where: { airportId: airport.id, type: p.type, name: p.name } });
      if (!exists) await db.parkingOption.create({ data: { airportId: airport.id, ...p } });
    }

    const faqCount = await db.fAQ.count({ where: { airportId: airport.id } });
    if (faqCount === 0) {
      await db.fAQ.createMany({
        data: [
          { airportId: airport.id, question: "What are the IATA and ICAO codes for " + a.name + "?", answer: a.name + " uses the IATA code " + a.iata + " and the ICAO code " + a.icao + ".", sortOrder: 0 },
          { airportId: airport.id, question: "What time zone is " + a.name + " in?", answer: a.name + " operates on " + a.timezone + " time.", sortOrder: 1 },
        ],
      });
    }

    const genericTips = [
      "Arrive at least 3 hours before an international flight and 2 hours before a domestic one, especially during peak travel seasons.",
      "Keep a digital and printed copy of your passport, visa, and hotel booking - some immigration desks still ask for paper copies.",
      "Check your airline's current baggage allowance before you pack; extra-bag fees at the airport are almost always pricier than paying online in advance.",
      "Liquids in carry-on baggage generally need to be in containers of 100ml or less, packed in a single clear resealable bag - rules can vary slightly by country.",
      "Check live flight status before leaving for the airport - gate and terminal assignments can change closer to departure.",
      "If you have a tight connection, check your airline's minimum connection time for this specific airport before booking.",
    ];
    const tipCount = await db.airportTip.count({ where: { airportId: airport.id } });
    if (tipCount === 0) {
      for (let i = 0; i < genericTips.length; i++) {
        await db.airportTip.create({ data: { airportId: airport.id, tip: genericTips[i], sortOrder: i } });
      }
    }

    console.log("Done: " + airport.name);
  }

  console.log("Batch 3 complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });