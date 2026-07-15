import { PrismaClient, AirportStatus, AmenityCategory, TransferType, ParkingType } from "@prisma/client";

const db = new PrismaClient();

type CountrySeed = { name: string; slug: string; isoCode2: string; isoCode3: string; region: string };
type CitySeed = { name: string; slug: string; lat: number; lon: number; countrySlug: string };

const countries: CountrySeed[] = [
  { name: "Pakistan", slug: "pakistan", isoCode2: "PK", isoCode3: "PAK", region: "Asia" },
  { name: "Saudi Arabia", slug: "saudi-arabia", isoCode2: "SA", isoCode3: "SAU", region: "Middle East" },
  { name: "Oman", slug: "oman", isoCode2: "OM", isoCode3: "OMN", region: "Middle East" },
  { name: "Kuwait", slug: "kuwait", isoCode2: "KW", isoCode3: "KWT", region: "Middle East" },
  { name: "Netherlands", slug: "netherlands", isoCode2: "NL", isoCode3: "NLD", region: "Europe" },
  { name: "Germany", slug: "germany", isoCode2: "DE", isoCode3: "DEU", region: "Europe" },
  { name: "Spain", slug: "spain", isoCode2: "ES", isoCode3: "ESP", region: "Europe" },
  { name: "Italy", slug: "italy", isoCode2: "IT", isoCode3: "ITA", region: "Europe" },
  { name: "Canada", slug: "canada", isoCode2: "CA", isoCode3: "CAN", region: "North America" },
  { name: "Australia", slug: "australia", isoCode2: "AU", isoCode3: "AUS", region: "Oceania" },
  { name: "Thailand", slug: "thailand", isoCode2: "TH", isoCode3: "THA", region: "Asia" },
  { name: "Malaysia", slug: "malaysia", isoCode2: "MY", isoCode3: "MYS", region: "Asia" },
  { name: "Hong Kong", slug: "hong-kong", isoCode2: "HK", isoCode3: "HKG", region: "Asia" },
  { name: "India", slug: "india", isoCode2: "IN", isoCode3: "IND", region: "Asia" },
];

const cities: CitySeed[] = [
  { name: "Karachi", slug: "karachi", lat: 24.8607, lon: 67.0011, countrySlug: "pakistan" },
  { name: "Lahore", slug: "lahore", lat: 31.5497, lon: 74.3436, countrySlug: "pakistan" },
  { name: "Islamabad", slug: "islamabad", lat: 33.6844, lon: 73.0479, countrySlug: "pakistan" },
  { name: "Riyadh", slug: "riyadh", lat: 24.7136, lon: 46.6753, countrySlug: "saudi-arabia" },
  { name: "Jeddah", slug: "jeddah", lat: 21.4858, lon: 39.1925, countrySlug: "saudi-arabia" },
  { name: "Muscat", slug: "muscat", lat: 23.5859, lon: 58.4059, countrySlug: "oman" },
  { name: "Kuwait City", slug: "kuwait-city", lat: 29.3759, lon: 47.9774, countrySlug: "kuwait" },
  { name: "Amsterdam", slug: "amsterdam", lat: 52.3676, lon: 4.9041, countrySlug: "netherlands" },
  { name: "Frankfurt", slug: "frankfurt", lat: 50.1109, lon: 8.6821, countrySlug: "germany" },
  { name: "Madrid", slug: "madrid", lat: 40.4168, lon: -3.7038, countrySlug: "spain" },
  { name: "Rome", slug: "rome", lat: 41.9028, lon: 12.4964, countrySlug: "italy" },
  { name: "Toronto", slug: "toronto", lat: 43.6532, lon: -79.3832, countrySlug: "canada" },
  { name: "Sydney", slug: "sydney", lat: -33.8688, lon: 151.2093, countrySlug: "australia" },
  { name: "Bangkok", slug: "bangkok", lat: 13.7563, lon: 100.5018, countrySlug: "thailand" },
  { name: "Kuala Lumpur", slug: "kuala-lumpur", lat: 3.139, lon: 101.6869, countrySlug: "malaysia" },
  { name: "Hong Kong", slug: "hong-kong-city", lat: 22.3193, lon: 114.1694, countrySlug: "hong-kong" },
  { name: "Delhi", slug: "delhi", lat: 28.7041, lon: 77.1025, countrySlug: "india" },
];

const airports = [
  { slug: "karachi-jinnah-khi", name: "Jinnah International Airport", iata: "KHI", icao: "OPKC", citySlug: "karachi", countrySlug: "pakistan", latitude: 24.9065, longitude: 67.1608, elevationFt: 100, timezone: "Asia/Karachi", openedYear: 1929, runwayCount: 2, terminalCount: 2, annualPassengers: 7000000, annualPassengersYear: 2023, websiteUrl: "https://caapakistan.com.pk", overview: "Jinnah International is Pakistan's busiest airport, serving as the main gateway to Karachi and the primary hub for Pakistan International Airlines." },
  { slug: "lahore-allama-iqbal-lhe", name: "Allama Iqbal International Airport", iata: "LHE", icao: "OPLA", citySlug: "lahore", countrySlug: "pakistan", latitude: 31.5216, longitude: 74.4036, elevationFt: 712, timezone: "Asia/Karachi", openedYear: 2003, runwayCount: 1, terminalCount: 2, annualPassengers: 4500000, annualPassengersYear: 2023, websiteUrl: "https://caapakistan.com.pk", overview: "Allama Iqbal International serves Lahore, Pakistan's cultural capital, with a modern terminal complex handling both domestic and international traffic." },
  { slug: "islamabad-international-isb", name: "Islamabad International Airport", iata: "ISB", icao: "OPIS", citySlug: "islamabad", countrySlug: "pakistan", latitude: 33.549, longitude: 72.826, elevationFt: 1668, timezone: "Asia/Karachi", openedYear: 2018, runwayCount: 1, terminalCount: 1, annualPassengers: 5500000, annualPassengersYear: 2023, websiteUrl: "https://caapakistan.com.pk", overview: "Islamabad International opened in 2018 to replace the older Benazir Bhutto International Airport, and serves as the gateway to Pakistan's capital region." },
  { slug: "riyadh-king-khalid-ruh", name: "King Khalid International Airport", iata: "RUH", icao: "OERK", citySlug: "riyadh", countrySlug: "saudi-arabia", latitude: 24.9576, longitude: 46.6988, elevationFt: 2049, timezone: "Asia/Riyadh", openedYear: 1983, runwayCount: 2, terminalCount: 5, annualPassengers: 35000000, annualPassengersYear: 2024, websiteUrl: "https://www.riyadhairport.sa", overview: "King Khalid International is the main airport serving Riyadh, Saudi Arabia's capital, and the primary hub for Saudia." },
  { slug: "jeddah-king-abdulaziz-jed", name: "King Abdulaziz International Airport", iata: "JED", icao: "OEJN", citySlug: "jeddah", countrySlug: "saudi-arabia", latitude: 21.6796, longitude: 39.1565, elevationFt: 48, timezone: "Asia/Riyadh", openedYear: 1981, runwayCount: 2, terminalCount: 1, annualPassengers: 41000000, annualPassengersYear: 2024, websiteUrl: "https://www.jed-airport.sa", overview: "King Abdulaziz International is a key gateway for pilgrims traveling to Mecca and Medina, and one of Saudi Arabia's busiest airports." },
  { slug: "muscat-international-mct", name: "Muscat International Airport", iata: "MCT", icao: "OOMS", citySlug: "muscat", countrySlug: "oman", latitude: 23.5933, longitude: 58.2844, elevationFt: 48, timezone: "Asia/Muscat", openedYear: 2018, runwayCount: 2, terminalCount: 1, annualPassengers: 15000000, annualPassengersYear: 2023, websiteUrl: "https://www.muscatairport.co.om", overview: "Muscat International is Oman's main airport and the hub for Oman Air, featuring a terminal redeveloped and expanded in 2018." },
  { slug: "kuwait-international-kwi", name: "Kuwait International Airport", iata: "KWI", icao: "OKBK", citySlug: "kuwait-city", countrySlug: "kuwait", latitude: 29.2266, longitude: 47.9689, elevationFt: 206, timezone: "Asia/Kuwait", openedYear: 1962, runwayCount: 2, terminalCount: 2, annualPassengers: 15500000, annualPassengersYear: 2023, websiteUrl: "https://www.dgca.gov.kw", overview: "Kuwait International Airport is the country's main airport and the hub for Kuwait Airways and Jazeera Airways." },
  { slug: "amsterdam-schiphol-ams", name: "Amsterdam Airport Schiphol", iata: "AMS", icao: "EHAM", citySlug: "amsterdam", countrySlug: "netherlands", latitude: 52.3105, longitude: 4.7683, elevationFt: -11, timezone: "Europe/Amsterdam", openedYear: 1916, runwayCount: 6, terminalCount: 1, annualPassengers: 66800000, annualPassengersYear: 2024, websiteUrl: "https://www.schiphol.nl", overview: "Schiphol is the Netherlands' main airport and KLM's hub, notable for its single unified terminal and six runways." },
  { slug: "frankfurt-fra", name: "Frankfurt Airport", iata: "FRA", icao: "EDDF", citySlug: "frankfurt", countrySlug: "germany", latitude: 50.0379, longitude: 8.5622, elevationFt: 364, timezone: "Europe/Berlin", openedYear: 1936, runwayCount: 4, terminalCount: 2, annualPassengers: 61600000, annualPassengersYear: 2024, websiteUrl: "https://www.frankfurt-airport.com", overview: "Frankfurt Airport is Germany's busiest airport and Lufthansa's primary hub, serving as a major connecting point between Europe and the rest of the world." },
  { slug: "madrid-barajas-mad", name: "Adolfo Suarez Madrid-Barajas Airport", iata: "MAD", icao: "LEMD", citySlug: "madrid", countrySlug: "spain", latitude: 40.4983, longitude: -3.5676, elevationFt: 1998, timezone: "Europe/Madrid", openedYear: 1931, runwayCount: 4, terminalCount: 4, annualPassengers: 66000000, annualPassengersYear: 2024, websiteUrl: "https://www.aena.es", overview: "Madrid-Barajas is Spain's largest airport and Iberia's hub, known for Terminal 4's award-winning architecture." },
  { slug: "rome-fiumicino-fco", name: "Rome Fiumicino Airport", iata: "FCO", icao: "LIRF", citySlug: "rome", countrySlug: "italy", latitude: 41.8003, longitude: 12.2389, elevationFt: 13, timezone: "Europe/Rome", openedYear: 1961, runwayCount: 4, terminalCount: 3, annualPassengers: 48500000, annualPassengersYear: 2024, websiteUrl: "https://www.adr.it", overview: "Fiumicino, also known as Leonardo da Vinci Airport, is Italy's busiest airport and the main hub for ITA Airways." },
  { slug: "toronto-pearson-yyz", name: "Toronto Pearson International Airport", iata: "YYZ", icao: "CYYZ", citySlug: "toronto", countrySlug: "canada", latitude: 43.6777, longitude: -79.6248, elevationFt: 569, timezone: "America/Toronto", openedYear: 1939, runwayCount: 5, terminalCount: 2, annualPassengers: 50500000, annualPassengersYear: 2024, websiteUrl: "https://www.torontopearson.com", overview: "Toronto Pearson is Canada's busiest airport and Air Canada's primary hub, connecting the country to destinations worldwide." },
  { slug: "sydney-kingsford-smith-syd", name: "Sydney Kingsford Smith Airport", iata: "SYD", icao: "YSSY", citySlug: "sydney", countrySlug: "australia", latitude: -33.9399, longitude: 151.1753, elevationFt: 21, timezone: "Australia/Sydney", openedYear: 1920, runwayCount: 3, terminalCount: 3, annualPassengers: 41500000, annualPassengersYear: 2024, websiteUrl: "https://www.sydneyairport.com.au", overview: "Sydney Airport is Australia's busiest airport and the main hub for Qantas, located close to the city centre on Botany Bay." },
  { slug: "bangkok-suvarnabhumi-bkk", name: "Suvarnabhumi Airport", iata: "BKK", icao: "VTBS", citySlug: "bangkok", countrySlug: "thailand", latitude: 13.69, longitude: 100.7501, elevationFt: 5, timezone: "Asia/Bangkok", openedYear: 2006, runwayCount: 2, terminalCount: 1, annualPassengers: 55000000, annualPassengersYear: 2024, websiteUrl: "https://suvarnabhumiairport.com", overview: "Suvarnabhumi is Bangkok's main international airport and Thai Airways' hub, one of Southeast Asia's busiest air travel gateways." },
  { slug: "kuala-lumpur-international-kul", name: "Kuala Lumpur International Airport", iata: "KUL", icao: "WMKK", citySlug: "kuala-lumpur", countrySlug: "malaysia", latitude: 2.7456, longitude: 101.7099, elevationFt: 69, timezone: "Asia/Kuala_Lumpur", openedYear: 1998, runwayCount: 2, terminalCount: 2, annualPassengers: 32000000, annualPassengersYear: 2023, websiteUrl: "https://www.klia.com.my", overview: "Kuala Lumpur International is Malaysia's main airport and the hub for Malaysia Airlines and AirAsia, with a distinctive rainforest-themed satellite terminal." },
  { slug: "hong-kong-international-hkg", name: "Hong Kong International Airport", iata: "HKG", icao: "VHHH", citySlug: "hong-kong-city", countrySlug: "hong-kong", latitude: 22.308, longitude: 113.9185, elevationFt: 28, timezone: "Asia/Hong_Kong", openedYear: 1998, runwayCount: 3, terminalCount: 2, annualPassengers: 50000000, annualPassengersYear: 2024, websiteUrl: "https://www.hongkongairport.com", overview: "Hong Kong International is Cathay Pacific's hub and one of the world's busiest cargo and passenger airports, built on reclaimed land at Chek Lap Kok." },
  { slug: "delhi-indira-gandhi-del", name: "Indira Gandhi International Airport", iata: "DEL", icao: "VIDP", citySlug: "delhi", countrySlug: "india", latitude: 28.5562, longitude: 77.1, elevationFt: 777, timezone: "Asia/Kolkata", openedYear: 1962, runwayCount: 4, terminalCount: 3, annualPassengers: 73700000, annualPassengersYear: 2024, websiteUrl: "https://www.newdelhiairport.in", overview: "Indira Gandhi International is India's busiest airport and the main hub for IndiGo and Air India, serving the national capital region." },
];

async function main() {
  console.log("Seeding additional countries...");
  const countryRecords = new Map();
  for (const c of countries) {
    const rec = await db.country.upsert({ where: { slug: c.slug }, update: {}, create: c });
    countryRecords.set(c.slug, rec.id);
  }
  const existingCountries = await db.country.findMany({ select: { id: true, slug: true } });
  for (const c of existingCountries) countryRecords.set(c.slug, c.id);

  console.log("Seeding additional cities...");
  const cityRecords = new Map();
  for (const c of cities) {
    const countryId = countryRecords.get(c.countrySlug);
    const rec = await db.city.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, latitude: c.lat, longitude: c.lon, countryId },
    });
    cityRecords.set(c.slug, rec.id);
  }

  console.log("Seeding additional airports...");
  for (const a of airports) {
    const cityId = cityRecords.get(a.citySlug);
    const countryId = countryRecords.get(a.countrySlug);

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
        sourceNotes: "Core identity facts compiled from public airport-operator and aviation-reference data. Passenger totals are rounded approximations - confirm against the airport's official annual traffic report before relying on exact figures.",
      },
    });

    const starterAmenities = [
      { category: AmenityCategory.CURRENCY_EXCHANGE, name: "Currency exchange counter", location: "Arrivals hall" },
      { category: AmenityCategory.FREE_WIFI, name: "Free airport WiFi", location: "Terminal-wide" },
      { category: AmenityCategory.PHARMACY, name: "Airport pharmacy", location: "Departures hall" },
      { category: AmenityCategory.CHARGING_STATION, name: "Charging stations", location: "Gate seating areas" },
    ];
    for (const am of starterAmenities) {
      await db.amenity.create({ data: { airportId: airport.id, ...am } });
    }

    const transferSeeds = [
      { type: TransferType.TAXI, description: "Metered airport taxis available at designated ranks outside arrivals." },
      { type: TransferType.CAR_RENTAL, description: "Major car rental counters located in or near the terminal." },
    ];
    for (const tr of transferSeeds) {
      await db.transferOption.create({ data: { airportId: airport.id, ...tr } });
    }

    const parkingSeeds = [
      { type: ParkingType.SHORT_STAY, name: "Short-stay terminal parking" },
      { type: ParkingType.LONG_STAY, name: "Long-stay / economy parking" },
    ];
    for (const p of parkingSeeds) {
      await db.parkingOption.create({ data: { airportId: airport.id, ...p } });
    }

    await db.fAQ.createMany({
      data: [
        { airportId: airport.id, question: `What are the IATA and ICAO codes for ${a.name}?`, answer: `${a.name} uses the IATA code ${a.iata} and the ICAO code ${a.icao}.`, sortOrder: 0 },
        { airportId: airport.id, question: `What time zone is ${a.name} in?`, answer: `${a.name} operates on ${a.timezone} time.`, sortOrder: 1 },
      ],
    });
  }

  console.log(`Seed complete - added ${airports.length} airports.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });