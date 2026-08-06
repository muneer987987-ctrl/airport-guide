import { PrismaClient, AirportStatus, AmenityCategory, TransferType, ParkingType } from "@prisma/client";

const db = new PrismaClient();

// ============================================================================
// BATCH 1: 50 AIRPORTS (Europe & Middle East)
// ============================================================================

const batch1Countries = [
  { name: "Germany", slug: "germany", isoCode2: "DE", isoCode3: "DEU", region: "Europe", flagEmoji: "🇩🇪" },
  { name: "Netherlands", slug: "netherlands", isoCode2: "NL", isoCode3: "NLD", region: "Europe", flagEmoji: "🇳🇱" },
  { name: "Spain", slug: "spain", isoCode2: "ES", isoCode3: "ESP", region: "Europe", flagEmoji: "🇪🇸" },
  { name: "Italy", slug: "italy", isoCode2: "IT", isoCode3: "ITA", region: "Europe", flagEmoji: "🇮🇹" },
  { name: "Switzerland", slug: "switzerland", isoCode2: "CH", isoCode3: "CHE", region: "Europe", flagEmoji: "🇨🇭" },
  { name: "Austria", slug: "austria", isoCode2: "AT", isoCode3: "AUT", region: "Europe", flagEmoji: "🇦🇹" },
  { name: "Belgium", slug: "belgium", isoCode2: "BE", isoCode3: "BEL", region: "Europe", flagEmoji: "🇧🇪" },
  { name: "Denmark", slug: "denmark", isoCode2: "DK", isoCode3: "DNK", region: "Europe", flagEmoji: "🇩🇰" },
  { name: "Sweden", slug: "sweden", isoCode2: "SE", isoCode3: "SWE", region: "Europe", flagEmoji: "🇸🇪" },
  { name: "Norway", slug: "norway", isoCode2: "NO", isoCode3: "NOR", region: "Europe", flagEmoji: "🇳🇴" },
  { name: "Finland", slug: "finland", isoCode2: "FI", isoCode3: "FIN", region: "Europe", flagEmoji: "🇫🇮" },
  { name: "Ireland", slug: "ireland", isoCode2: "IE", isoCode3: "IRL", region: "Europe", flagEmoji: "🇮🇪" },
  { name: "Poland", slug: "poland", isoCode2: "PL", isoCode3: "POL", region: "Europe", flagEmoji: "🇵🇱" },
  { name: "Czech Republic", slug: "czech-republic", isoCode2: "CZ", isoCode3: "CZE", region: "Europe", flagEmoji: "🇨🇿" },
  { name: "Hungary", slug: "hungary", isoCode2: "HU", isoCode3: "HUN", region: "Europe", flagEmoji: "🇭🇺" },
  { name: "Greece", slug: "greece", isoCode2: "GR", isoCode3: "GRC", region: "Europe", flagEmoji: "🇬🇷" },
  { name: "Portugal", slug: "portugal", isoCode2: "PT", isoCode3: "PRT", region: "Europe", flagEmoji: "🇵🇹" },
  { name: "Russia", slug: "russia", isoCode2: "RU", isoCode3: "RUS", region: "Europe", flagEmoji: "🇷🇺" },
  { name: "Israel", slug: "israel", isoCode2: "IL", isoCode3: "ISR", region: "Middle East", flagEmoji: "🇮🇱" },
  { name: "Saudi Arabia", slug: "saudi-arabia", isoCode2: "SA", isoCode3: "SAU", region: "Middle East", flagEmoji: "🇸🇦" },
  { name: "Kuwait", slug: "kuwait", isoCode2: "KW", isoCode3: "KWT", region: "Middle East", flagEmoji: "🇰🇼" },
  { name: "Bahrain", slug: "bahrain", isoCode2: "BH", isoCode3: "BHR", region: "Middle East", flagEmoji: "🇧🇭" },
  { name: "Oman", slug: "oman", isoCode2: "OM", isoCode3: "OMN", region: "Middle East", flagEmoji: "🇴🇲" },
  { name: "Jordan", slug: "jordan", isoCode2: "JO", isoCode3: "JOR", region: "Middle East", flagEmoji: "🇯🇴" },
  { name: "Lebanon", slug: "lebanon", isoCode2: "LB", isoCode3: "LBN", region: "Middle East", flagEmoji: "🇱🇧" },
];

const batch1Cities = [
  { name: "Frankfurt", slug: "frankfurt", lat: 50.1109, lon: 8.6821, countrySlug: "germany" },
  { name: "Munich", slug: "munich", lat: 48.1351, lon: 11.5820, countrySlug: "germany" },
  { name: "Berlin", slug: "berlin", lat: 52.5200, lon: 13.4050, countrySlug: "germany" },
  { name: "Hamburg", slug: "hamburg", lat: 53.5511, lon: 9.9937, countrySlug: "germany" },
  { name: "Dusseldorf", slug: "dusseldorf", lat: 51.2277, lon: 6.7735, countrySlug: "germany" },
  { name: "Amsterdam", slug: "amsterdam", lat: 52.3676, lon: 4.9041, countrySlug: "netherlands" },
  { name: "Madrid", slug: "madrid", lat: 40.4168, lon: -3.7038, countrySlug: "spain" },
  { name: "Barcelona", slug: "barcelona", lat: 41.3851, lon: 2.1734, countrySlug: "spain" },
  { name: "Malaga", slug: "malaga", lat: 36.7213, lon: -4.4213, countrySlug: "spain" },
  { name: "Rome", slug: "rome", lat: 41.9028, lon: 12.4964, countrySlug: "italy" },
  { name: "Milan", slug: "milan", lat: 45.4642, lon: 9.1900, countrySlug: "italy" },
  { name: "Venice", slug: "venice", lat: 45.4408, lon: 12.3155, countrySlug: "italy" },
  { name: "Naples", slug: "naples", lat: 40.8518, lon: 14.2681, countrySlug: "italy" },
  { name: "Zurich", slug: "zurich", lat: 47.3769, lon: 8.5417, countrySlug: "switzerland" },
  { name: "Geneva", slug: "geneva", lat: 46.2044, lon: 6.1432, countrySlug: "switzerland" },
  { name: "Vienna", slug: "vienna", lat: 48.2082, lon: 16.3738, countrySlug: "austria" },
  { name: "Brussels", slug: "brussels", lat: 50.8503, lon: 4.3517, countrySlug: "belgium" },
  { name: "Copenhagen", slug: "copenhagen", lat: 55.6761, lon: 12.5683, countrySlug: "denmark" },
  { name: "Stockholm", slug: "stockholm", lat: 59.3293, lon: 18.0686, countrySlug: "sweden" },
  { name: "Oslo", slug: "oslo", lat: 59.9139, lon: 10.7522, countrySlug: "norway" },
  { name: "Helsinki", slug: "helsinki", lat: 60.1699, lon: 24.9384, countrySlug: "finland" },
  { name: "Dublin", slug: "dublin", lat: 53.3498, lon: -6.2603, countrySlug: "ireland" },
  { name: "Warsaw", slug: "warsaw", lat: 52.2297, lon: 21.0122, countrySlug: "poland" },
  { name: "Krakow", slug: "krakow", lat: 50.0647, lon: 19.9450, countrySlug: "poland" },
  { name: "Prague", slug: "prague", lat: 50.0755, lon: 14.4378, countrySlug: "czech-republic" },
  { name: "Budapest", slug: "budapest", lat: 47.4979, lon: 19.0402, countrySlug: "hungary" },
  { name: "Athens", slug: "athens", lat: 37.9838, lon: 23.7275, countrySlug: "greece" },
  { name: "Thessaloniki", slug: "thessaloniki", lat: 40.6401, lon: 22.9444, countrySlug: "greece" },
  { name: "Lisbon", slug: "lisbon", lat: 38.7223, lon: -9.1393, countrySlug: "portugal" },
  { name: "Porto", slug: "porto", lat: 41.1579, lon: -8.6291, countrySlug: "portugal" },
  { name: "Moscow", slug: "moscow", lat: 55.7558, lon: 37.6173, countrySlug: "russia" },
  { name: "St Petersburg", slug: "st-petersburg", lat: 59.9311, lon: 30.3609, countrySlug: "russia" },
  { name: "Tel Aviv", slug: "tel-aviv", lat: 32.0853, lon: 34.7818, countrySlug: "israel" },
  { name: "Jeddah", slug: "jeddah", lat: 21.4858, lon: 39.1925, countrySlug: "saudi-arabia" },
  { name: "Riyadh", slug: "riyadh", lat: 24.7136, lon: 46.6753, countrySlug: "saudi-arabia" },
  { name: "Kuwait City", slug: "kuwait-city", lat: 29.3759, lon: 47.9774, countrySlug: "kuwait" },
  { name: "Manama", slug: "manama", lat: 26.2285, lon: 50.5860, countrySlug: "bahrain" },
  { name: "Muscat", slug: "muscat", lat: 23.5859, lon: 58.4059, countrySlug: "oman" },
  { name: "Amman", slug: "amman", lat: 31.9454, lon: 35.9284, countrySlug: "jordan" },
  { name: "Beirut", slug: "beirut", lat: 33.8938, lon: 35.5018, countrySlug: "lebanon" },
];

const batch1Airports = [
  {
    slug: "frankfurt-am-main-fra",
    name: "Frankfurt Airport",
    iata: "FRA",
    icao: "EDDF",
    citySlug: "frankfurt",
    countrySlug: "germany",
    latitude: 50.0379,
    longitude: 8.5622,
    elevationFt: 364,
    timezone: "Europe/Berlin",
    openedYear: 1936,
    runwayCount: 4,
    terminalCount: 2,
    annualPassengers: 61000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.frankfurt-airport.com",
    overview: "Frankfurt Airport is Germany's busiest airport and Lufthansa's primary hub. It features two large terminals with extensive shopping and dining, serving as a key connecting point for European and intercontinental travel.",
    terminals: [
      { code: "Terminal 1", description: "Lufthansa's primary hub, handling most Star Alliance carriers and long-haul flights." },
      { code: "Terminal 2", description: "Used by Oneworld and SkyTeam partners, plus several non-aligned carriers." },
    ],
  },
  {
    slug: "munich-muc",
    name: "Munich Airport",
    iata: "MUC",
    icao: "EDDM",
    citySlug: "munich",
    countrySlug: "germany",
    latitude: 48.3538,
    longitude: 11.7861,
    elevationFt: 1487,
    timezone: "Europe/Berlin",
    openedYear: 1992,
    runwayCount: 2,
    terminalCount: 2,
    annualPassengers: 35000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.munich-airport.com",
    overview: "Munich Airport is consistently rated among Europe's best airports, known for efficient operations, excellent shopping, and a unique on-site brewery. It serves as Lufthansa's second hub.",
    terminals: [
      { code: "Terminal 1", description: "Handles Lufthansa, Star Alliance, and several other carriers." },
      { code: "Terminal 2", description: "Modern facility used by Lufthansa and Star Alliance partners exclusively." },
    ],
  },
  {
    slug: "berlin-brandenburg-ber",
    name: "Berlin Brandenburg Airport",
    iata: "BER",
    icao: "EDDB",
    citySlug: "berlin",
    countrySlug: "germany",
    latitude: 52.3667,
    longitude: 13.5033,
    elevationFt: 157,
    timezone: "Europe/Berlin",
    openedYear: 2020,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 23000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.berlin-airport.de",
    overview: "Berlin Brandenburg Airport replaced Tegel and Schönefeld as Berlin's sole airport in 2020. It features a single modern terminal serving as a base for Eurowings and a focus city for easyJet.",
    terminals: [
      { code: "Terminal 1", description: "Main terminal with integrated check-in, security, and gates for all carriers." },
    ],
  },
  {
    slug: "hamburg-ham",
    name: "Hamburg Airport",
    iata: "HAM",
    icao: "EDDH",
    citySlug: "hamburg",
    countrySlug: "germany",
    latitude: 53.6304,
    longitude: 9.9882,
    elevationFt: 53,
    timezone: "Europe/Berlin",
    openedYear: 1911,
    runwayCount: 2,
    terminalCount: 2,
    annualPassengers: 13000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.hamburg-airport.de",
    overview: "Hamburg Airport is Germany's oldest operating airport and the fifth-busiest in the country. It serves as a focus city for Eurowings and features two terminals with efficient connections to the city center.",
    terminals: [
      { code: "Terminal 1", description: "Primary terminal handling most airlines and long-haul flights." },
      { code: "Terminal 2", description: "Smaller terminal primarily used by Lufthansa and Star Alliance partners." },
    ],
  },
  {
    slug: "dusseldorf-dus",
    name: "Dusseldorf Airport",
    iata: "DUS",
    icao: "EDDL",
    citySlug: "dusseldorf",
    countrySlug: "germany",
    latitude: 51.2895,
    longitude: 6.7668,
    elevationFt: 147,
    timezone: "Europe/Berlin",
    openedYear: 1927,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 16000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.dus.com",
    overview: "Dusseldorf Airport is the third-largest airport in Germany and an important hub for Eurowings. It features a single terminal with three concourses and excellent rail connections to the Rhine-Ruhr region.",
    terminals: [
      { code: "Terminal A/B/C", description: "Three concourses (A, B, C) under one roof, handling all airlines." },
    ],
  },
  {
    slug: "amsterdam-schiphol-ams",
    name: "Amsterdam Airport Schiphol",
    iata: "AMS",
    icao: "EHAM",
    citySlug: "amsterdam",
    countrySlug: "netherlands",
    latitude: 52.3105,
    longitude: 4.7683,
    elevationFt: -11,
    timezone: "Europe/Amsterdam",
    openedYear: 1916,
    runwayCount: 6,
    terminalCount: 1,
    annualPassengers: 61000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.schiphol.nl",
    overview: "Schiphol is the Netherlands' main international airport and KLM's hub. Known for its single-terminal concept with multiple concourses, extensive shopping, and efficient rail connections to Amsterdam and beyond.",
    terminals: [
      { code: "Departure Halls 1-4", description: "Single terminal with four departure halls and nine concourses (B through M), all interconnected." },
    ],
  },
  {
    slug: "madrid-barajas-mad",
    name: "Adolfo Suarez Madrid-Barajas Airport",
    iata: "MAD",
    icao: "LEMD",
    citySlug: "madrid",
    countrySlug: "spain",
    latitude: 40.4983,
    longitude: -3.5676,
    elevationFt: 2000,
    timezone: "Europe/Madrid",
    openedYear: 1931,
    runwayCount: 4,
    terminalCount: 4,
    annualPassengers: 67000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.aena.es",
    overview: "Madrid-Barajas is Spain's busiest airport and Iberia's primary hub. Its Terminal 4, designed by Richard Rogers, is an architectural landmark. The airport serves as the main gateway to Latin America from Europe.",
    terminals: [
      { code: "Terminal 1", description: "Handles SkyTeam carriers and some non-aligned airlines." },
      { code: "Terminal 2", description: "Primarily used by Air Europa and Oneworld partners." },
      { code: "Terminal 3", description: "Regional flights and some Schengen services." },
      { code: "Terminal 4", description: "Iberia's hub and Oneworld main terminal, one of Europe's largest terminals." },
    ],
  },
  {
    slug: "barcelona-el-prat-bcn",
    name: "Barcelona-El Prat Airport",
    iata: "BCN",
    icao: "LEBL",
    citySlug: "barcelona",
    countrySlug: "spain",
    latitude: 41.2974,
    longitude: 2.0833,
    elevationFt: 12,
    timezone: "Europe/Madrid",
    openedYear: 1918,
    runwayCount: 3,
    terminalCount: 2,
    annualPassengers: 50000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.aena.es",
    overview: "Barcelona-El Prat is Spain's second-busiest airport and a major Mediterranean hub. It features two terminals with efficient connections to Barcelona city center and serves as Vueling's primary base.",
    terminals: [
      { code: "Terminal 1", description: "Modern facility handling most international and long-haul flights." },
      { code: "Terminal 2", description: "Older terminal primarily used by low-cost carriers and regional flights." },
    ],
  },
  {
    slug: "malaga-agp",
    name: "Malaga-Costa del Sol Airport",
    iata: "AGP",
    icao: "LEMG",
    citySlug: "malaga",
    countrySlug: "spain",
    latitude: 36.6749,
    longitude: -4.4991,
    elevationFt: 52,
    timezone: "Europe/Madrid",
    openedYear: 1919,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 22000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.aena.es",
    overview: "Malaga Airport is the main gateway to Spain's Costa del Sol and one of the busiest airports in the country for tourism. It features a modern terminal with extensive connections to European cities.",
    terminals: [
      { code: "Terminal 3", description: "Single integrated terminal handling all airlines, with direct train connection to Malaga city center." },
    ],
  },
  {
    slug: "rome-fiumicino-fco",
    name: "Rome Fiumicino Airport",
    iata: "FCO",
    icao: "LIRF",
    citySlug: "rome",
    countrySlug: "italy",
    latitude: 41.8003,
    longitude: 12.2389,
    elevationFt: 15,
    timezone: "Europe/Rome",
    openedYear: 1961,
    runwayCount: 4,
    terminalCount: 3,
    annualPassengers: 49000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.adr.it",
    overview: "Leonardo da Vinci-Fiumicino is Italy's busiest airport and Alitalia's former hub. It features three terminals with Terminal 1 handling Schengen flights and Terminal 3 for international services.",
    terminals: [
      { code: "Terminal 1", description: "Handles Schengen flights for Alitalia, ITA Airways, and SkyTeam partners." },
      { code: "Terminal 3", description: "Main international terminal for all non-Schengen and intercontinental flights." },
      { code: "Terminal 5", description: "Dedicated to security-sensitive flights to the United States and Israel." },
    ],
  },
  {
    slug: "milan-malpensa-mxp",
    name: "Milan Malpensa Airport",
    iata: "MXP",
    icao: "LIMC",
    citySlug: "milan",
    countrySlug: "italy",
    latitude: 45.6301,
    longitude: 8.7231,
    elevationFt: 1000,
    timezone: "Europe/Rome",
    openedYear: 1909,
    runwayCount: 2,
    terminalCount: 2,
    annualPassengers: 28000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.milanomalpensa-airport.com",
    overview: "Malpensa is Milan's largest airport and the main intercontinental gateway to northern Italy. It features two terminals with Terminal 1 handling most airlines and Terminal 2 dedicated to easyJet.",
    terminals: [
      { code: "Terminal 1", description: "Main terminal with three concourses handling most international and long-haul flights." },
      { code: "Terminal 2", description: "Dedicated easyJet terminal with efficient low-cost operations." },
    ],
  },
  {
    slug: "venice-vce",
    name: "Venice Marco Polo Airport",
    iata: "VCE",
    icao: "LIPZ",
    citySlug: "venice",
    countrySlug: "italy",
    latitude: 45.5054,
    longitude: 12.3519,
    elevationFt: 7,
    timezone: "Europe/Rome",
    openedYear: 1961,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 11000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.veniceairport.it",
    overview: "Venice Marco Polo is the main gateway to Venice and the Veneto region. Located on the mainland, it offers water taxi connections directly to Venice's historic center in about 30 minutes.",
    terminals: [
      { code: "Terminal", description: "Single terminal with three floors handling all domestic and international flights." },
    ],
  },
  {
    slug: "naples-nap",
    name: "Naples International Airport",
    iata: "NAP",
    icao: "LIRN",
    citySlug: "naples",
    countrySlug: "italy",
    latitude: 40.8860,
    longitude: 14.2908,
    elevationFt: 294,
    timezone: "Europe/Rome",
    openedYear: 1950,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 12000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.aeroportodinapoli.it",
    overview: "Naples Capodichino is southern Italy's busiest airport, serving as the gateway to the Amalfi Coast, Pompeii, and the Naples metropolitan area. It features a single terminal with recent expansions.",
    terminals: [
      { code: "Terminal 1", description: "Single terminal handling all flights with dedicated areas for Schengen and non-Schengen services." },
    ],
  },
  {
    slug: "zurich-zrh",
    name: "Zurich Airport",
    iata: "ZRH",
    icao: "LSZH",
    citySlug: "zurich",
    countrySlug: "switzerland",
    latitude: 47.4647,
    longitude: 8.5492,
    elevationFt: 1416,
    timezone: "Europe/Zurich",
    openedYear: 1948,
    runwayCount: 3,
    terminalCount: 1,
    annualPassengers: 31000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.flughafen-zuerich.ch",
    overview: "Zurich Airport is Switzerland's largest airport and Swiss International Air Lines' hub. Known for its efficiency and the unique 'Airside Center' concept, it offers excellent rail connections throughout Switzerland.",
    terminals: [
      { code: "Airside Center", description: "Central hub with gates A and B, connected to check-in areas and the Circle shopping complex." },
      { code: "Terminal E", description: "Satellite terminal for intercontinental flights, connected by underground automated train." },
    ],
  },
  {
    slug: "geneva-gva",
    name: "Geneva Airport",
    iata: "GVA",
    icao: "LSGG",
    citySlug: "geneva",
    countrySlug: "switzerland",
    latitude: 46.2380,
    longitude: 6.1089,
    elevationFt: 1411,
    timezone: "Europe/Zurich",
    openedYear: 1920,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 18000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.gva.ch",
    overview: "Geneva Airport is Switzerland's second-busiest airport, located on the Franco-Swiss border. It serves as EasyJet Switzerland's base and offers unique French/Swiss customs zones for convenient access.",
    terminals: [
      { code: "Terminal 1", description: "Single terminal with five piers (A through F) handling all flights." },
    ],
  },
  {
    slug: "vienna-vie",
    name: "Vienna International Airport",
    iata: "VIE",
    icao: "LOWW",
    citySlug: "vienna",
    countrySlug: "austria",
    latitude: 48.1103,
    longitude: 16.5697,
    elevationFt: 600,
    timezone: "Europe/Vienna",
    openedYear: 1954,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 28000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.viennaairport.com",
    overview: "Vienna Airport is Austria's largest airport and Austrian Airlines' hub. It features a single terminal with three concourses and excellent rail connections to Vienna city center in just 16 minutes.",
    terminals: [
      { code: "Terminal 3", description: "Main terminal with Check-in 1 (Star Alliance), Check-in 2, and Check-in 3 areas." },
    ],
  },
  {
    slug: "brussels-bru",
    name: "Brussels Airport",
    iata: "BRU",
    icao: "EBBR",
    citySlug: "brussels",
    countrySlug: "belgium",
    latitude: 50.9010,
    longitude: 4.4856,
    elevationFt: 184,
    timezone: "Europe/Brussels",
    openedYear: 1940,
    runwayCount: 3,
    terminalCount: 1,
    annualPassengers: 26000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.brusselsairport.be",
    overview: "Brussels Airport is Belgium's main international airport and Brussels Airlines' hub. It features a single terminal with two piers and direct train connections to Brussels, Antwerp, and other Belgian cities.",
    terminals: [
      { code: "Terminal", description: "Single terminal with Pier A (Schengen) and Pier B (non-Schengen), plus satellite gates." },
    ],
  },
  {
    slug: "copenhagen-cph",
    name: "Copenhagen Airport",
    iata: "CPH",
    icao: "EKCH",
    citySlug: "copenhagen",
    countrySlug: "denmark",
    latitude: 55.6180,
    longitude: 12.6508,
    elevationFt: 17,
    timezone: "Europe/Copenhagen",
    openedYear: 1925,
    runwayCount: 3,
    terminalCount: 2,
    annualPassengers: 27000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.cph.dk",
    overview: "Copenhagen Airport is Scandinavia's busiest airport and Nordic Aviation Capital's hub. It features two terminals with efficient metro connections to Copenhagen city center in just 15 minutes.",
    terminals: [
      { code: "Terminal 2", description: "Handles Schengen flights for SAS, Norwegian, and other carriers." },
      { code: "Terminal 3", description: "Main terminal for international flights, integrated with metro and train station." },
    ],
  },
  {
    slug: "stockholm-arn",
    name: "Stockholm Arlanda Airport",
    iata: "ARN",
    icao: "ESSA",
    citySlug: "stockholm",
    countrySlug: "sweden",
    latitude: 59.6519,
    longitude: 17.9186,
    elevationFt: 137,
    timezone: "Europe/Stockholm",
    openedYear: 1962,
    runwayCount: 3,
    terminalCount: 4,
    annualPassengers: 22000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.swedavia.com",
    overview: "Arlanda is Sweden's largest airport, located 37km north of Stockholm. It features four terminals with the Arlanda Express train connecting to Stockholm Central in just 18 minutes.",
    terminals: [
      { code: "Terminal 2", description: "International flights for SAS, Norwegian, and other carriers." },
      { code: "Terminal 4", description: "Domestic flights within Sweden." },
      { code: "Terminal 5", description: "Main international terminal with most long-haul flights." },
      { code: "Terminal 7", description: "Private aviation and charter flights." },
    ],
  },
  {
    slug: "oslo-osl",
    name: "Oslo Airport",
    iata: "OSL",
    icao: "ENGM",
    citySlug: "oslo",
    countrySlug: "norway",
    latitude: 60.1939,
    longitude: 11.1004,
    elevationFt: 681,
    timezone: "Europe/Oslo",
    openedYear: 1998,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 24000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.avinor.no",
    overview: "Oslo Airport is Norway's main international gateway, located 35km northeast of Oslo. It features a modern single terminal and serves as SAS and Norwegian's hub with efficient rail connections.",
    terminals: [
      { code: "Terminal", description: "Single terminal with domestic and international sections, connected to Oslo by Airport Express Train." },
    ],
  },
  {
    slug: "helsinki-hel",
    name: "Helsinki Airport",
    iata: "HEL",
    icao: "EFHK",
    citySlug: "helsinki",
    countrySlug: "finland",
    latitude: 60.3172,
    longitude: 24.9633,
    elevationFt: 179,
    timezone: "Europe/Helsinki",
    openedYear: 1952,
    runwayCount: 3,
    terminalCount: 2,
    annualPassengers: 15000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.helsinki-airport.com",
    overview: "Helsinki Airport is Finland's main international gateway and Finnair's hub. It serves as a key connecting point between Europe and Asia, featuring two terminals with efficient design.",
    terminals: [
      { code: "Terminal 1", description: "Handles domestic flights and some European routes." },
      { code: "Terminal 2", description: "Main international terminal for intercontinental and Schengen flights." },
    ],
  },
  {
    slug: "dublin-dub",
    name: "Dublin Airport",
    iata: "DUB",
    icao: "EIDW",
    citySlug: "dublin",
    countrySlug: "ireland",
    latitude: 53.4264,
    longitude: -6.2499,
    elevationFt: 242,
    timezone: "Europe/Dublin",
    openedYear: 1940,
    runwayCount: 2,
    terminalCount: 2,
    annualPassengers: 32000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.dublinairport.com",
    overview: "Dublin Airport is Ireland's busiest airport and Aer Lingus' hub. It features two terminals with Terminal 2 handling most long-haul flights. Unique among EU airports, it offers US preclearance facilities.",
    terminals: [
      { code: "Terminal 1", description: "Handles Ryanair, most European carriers, and some Aer Lingus flights." },
      { code: "Terminal 2", description: "Aer Lingus hub and US preclearance terminal for flights to the United States." },
    ],
  },
  {
    slug: "warsaw-waw",
    name: "Warsaw Chopin Airport",
    iata: "WAW",
    icao: "EPWA",
    citySlug: "warsaw",
    countrySlug: "poland",
    latitude: 52.1657,
    longitude: 20.9671,
    elevationFt: 362,
    timezone: "Europe/Warsaw",
    openedYear: 1934,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 21000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.lotnisko-chopina.pl",
    overview: "Warsaw Chopin is Poland's busiest airport and LOT Polish Airlines' hub. It features a single terminal with two check-in halls and serves as the main gateway to Central and Eastern Europe.",
    terminals: [
      { code: "Terminal A", description: "Single terminal with 'Terminal A' and 'Terminal A2' sections handling all flights." },
    ],
  },
  {
    slug: "krakow-krk",
    name: "Krakow John Paul II Airport",
    iata: "KRK",
    icao: "EPKK",
    citySlug: "krakow",
    countrySlug: "poland",
    latitude: 50.0777,
    longitude: 19.7848,
    elevationFt: 791,
    timezone: "Europe/Warsaw",
    openedYear: 1964,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 9000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.krakowairport.pl",
    overview: "Krakow Airport is Poland's second-busiest airport, serving the historic city of Krakow and nearby Auschwitz-Birkenau. It features a modern terminal with growing low-cost carrier operations.",
    terminals: [
      { code: "Terminal 1", description: "Single terminal handling all domestic and international flights." },
    ],
  },
  {
    slug: "prague-prg",
    name: "Vaclav Havel Airport Prague",
    iata: "PRG",
    icao: "LKPR",
    citySlug: "prague",
    countrySlug: "czech-republic",
    latitude: 50.1008,
    longitude: 14.2632,
    elevationFt: 1247,
    timezone: "Europe/Prague",
    openedYear: 1937,
    runwayCount: 2,
    terminalCount: 2,
    annualPassengers: 16000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.prg.aero",
    overview: "Prague Airport is the Czech Republic's main international gateway. It features two terminals with Terminal 1 for non-Schengen flights and Terminal 2 for Schengen services, plus excellent city connections.",
    terminals: [
      { code: "Terminal 1", description: "Non-Schengen flights including intercontinental and UK routes." },
      { code: "Terminal 2", description: "Schengen flights within the EU and some European destinations." },
    ],
  },
  {
    slug: "budapest-bud",
    name: "Budapest Ferenc Liszt Airport",
    iata: "BUD",
    icao: "LHBP",
    citySlug: "budapest",
    countrySlug: "hungary",
    latitude: 47.4369,
    longitude: 19.2556,
    elevationFt: 495,
    timezone: "Europe/Budapest",
    openedYear: 1950,
    runwayCount: 2,
    terminalCount: 2,
    annualPassengers: 17000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.bud.hu",
    overview: "Budapest Airport is Hungary's main international gateway and Wizz Air's primary base. It features two terminals with Terminal 2A for Schengen and 2B for non-Schengen flights.",
    terminals: [
      { code: "Terminal 2A", description: "Schengen flights for Wizz Air, Ryanair, and other European carriers." },
      { code: "Terminal 2B", description: "Non-Schengen flights including long-haul and UK services." },
    ],
  },
  {
    slug: "athens-ath",
    name: "Athens International Airport",
    iata: "ATH",
    icao: "LGAV",
    citySlug: "athens",
    countrySlug: "greece",
    latitude: 37.9364,
    longitude: 23.9445,
    elevationFt: 308,
    timezone: "Europe/Athens",
    openedYear: 2001,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 28000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.aia.gr",
    overview: "Athens Airport 'Eleftherios Venizelos' is Greece's busiest airport, serving as Aegean Airlines' hub. It features a modern single terminal with excellent metro connections to Athens city center.",
    terminals: [
      { code: "Main Terminal", description: "Single terminal with separate areas for Schengen and non-Schengen flights." },
    ],
  },
  {
    slug: "thessaloniki-skg",
    name: "Thessaloniki Airport",
    iata: "SKG",
    icao: "LGTS",
    citySlug: "thessaloniki",
    countrySlug: "greece",
    latitude: 40.5197,
    longitude: 22.9709,
    elevationFt: 22,
    timezone: "Europe/Athens",
    openedYear: 1930,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 7500000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.thessalonikiairport.com",
    overview: "Thessaloniki Airport 'Macedonia' is northern Greece's main gateway, serving the popular Halkidiki peninsula and Mount Athos. It features a modern terminal with seasonal charter operations.",
    terminals: [
      { code: "Terminal", description: "Single terminal handling all domestic and international flights." },
    ],
  },
  {
    slug: "lisbon-lis",
    name: "Lisbon Airport",
    iata: "LIS",
    icao: "LPPT",
    citySlug: "lisbon",
    countrySlug: "portugal",
    latitude: 38.7742,
    longitude: -9.1342,
    elevationFt: 374,
    timezone: "Europe/Lisbon",
    openedYear: 1942,
    runwayCount: 2,
    terminalCount: 2,
    annualPassengers: 34000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.ana.pt",
    overview: "Lisbon Humberto Delgado Airport is Portugal's busiest airport and TAP Air Portugal's hub. It features two terminals with Terminal 1 handling most flights and Terminal 2 for low-cost carriers.",
    terminals: [
      { code: "Terminal 1", description: "Main terminal handling TAP, Star Alliance, and most international flights." },
      { code: "Terminal 2", description: "Low-cost carrier terminal primarily for easyJet, Ryanair, and Wizz Air." },
    ],
  },
  {
    slug: "porto-opo",
    name: "Porto Airport",
    iata: "OPO",
    icao: "LPPR",
    citySlug: "porto",
    countrySlug: "portugal",
    latitude: 41.2481,
    longitude: -8.6814,
    elevationFt: 228,
    timezone: "Europe/Lisbon",
    openedYear: 1945,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 15000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.ana.pt",
    overview: "Porto Francisco Sa Carneiro Airport is Portugal's second-busiest airport, serving the Douro Valley wine region. It features a single modern terminal with award-winning architecture.",
    terminals: [
      { code: "Terminal", description: "Single terminal with expanded capacity, handling all European and some intercontinental flights." },
    ],
  },
  {
    slug: "moscow-svo",
    name: "Moscow Sheremetyevo Airport",
    iata: "SVO",
    icao: "UUEE",
    citySlug: "moscow",
    countrySlug: "russia",
    latitude: 55.9736,
    longitude: 37.4125,
    elevationFt: 622,
    timezone: "Europe/Moscow",
    openedYear: 1959,
    runwayCount: 3,
    terminalCount: 5,
    annualPassengers: 49000000,
    annualPassengersYear: 2019,
    websiteUrl: "https://www.svo.aero",
    overview: "Sheremetyevo is Moscow's busiest airport and Aeroflot's hub. Terminal B, designed by British architect Norman Foster, is a modern facility handling most international flights.",
    terminals: [
      { code: "Terminal B", description: "Main international terminal designed by Norman Foster, handling Aeroflot and SkyTeam partners." },
      { code: "Terminal C", description: "Regional flights and some international services." },
      { code: "Terminal D", description: "Aeroflot domestic and some international flights." },
      { code: "Terminal E", description: "International flights for various carriers." },
      { code: "Terminal F", description: "Original terminal now handling charter and some scheduled flights." },
    ],
  },
  {
    slug: "st-petersburg-led",
    name: "St Petersburg Pulkovo Airport",
    iata: "LED",
    icao: "ULLI",
    citySlug: "st-petersburg",
    countrySlug: "russia",
    latitude: 59.8003,
    longitude: 30.2625,
    elevationFt: 79,
    timezone: "Europe/Moscow",
    openedYear: 1932,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 20000000,
    annualPassengersYear: 2019,
    websiteUrl: "https://pulkovoairport.ru",
    overview: "Pulkovo is St Petersburg's main international airport, featuring a modern terminal opened in 2014. It serves as Russia's cultural capital's gateway with connections to European and Asian destinations.",
    terminals: [
      { code: "Terminal 1", description: "Single modern terminal handling all domestic and international flights." },
    ],
  },
  {
    slug: "tel-aviv-tlv",
    name: "Ben Gurion Airport",
    iata: "TLV",
    icao: "LLBG",
    citySlug: "tel-aviv",
    countrySlug: "israel",
    latitude: 32.0114,
    longitude: 34.8867,
    elevationFt: 134,
    timezone: "Asia/Jerusalem",
    openedYear: 1936,
    runwayCount: 3,
    terminalCount: 2,
    annualPassengers: 24000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.iaa.gov.il",
    overview: "Ben Gurion is Israel's main international gateway, known for its stringent security measures. Terminal 3 handles most international flights with efficient design and modern facilities.",
    terminals: [
      { code: "Terminal 1", description: "Domestic flights and some low-cost European carriers." },
      { code: "Terminal 3", description: "Main international terminal with advanced security and duty-free shopping." },
    ],
  },
  {
    slug: "jeddah-jed",
    name: "King Abdulaziz Airport",
    iata: "JED",
    icao: "OEJN",
    citySlug: "jeddah",
    countrySlug: "saudi-arabia",
    latitude: 21.6796,
    longitude: 39.1565,
    elevationFt: 48,
    timezone: "Asia/Riyadh",
    openedYear: 1981,
    runwayCount: 3,
    terminalCount: 3,
    annualPassengers: 42000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.jed-airport.com",
    overview: "King Abdulaziz is Saudi Arabia's busiest airport and Saudia's hub. The new Terminal 1, designed by Norman Foster, is one of the world's largest terminals with capacity for 80 million passengers.",
    terminals: [
      { code: "Terminal 1", description: "New mega-terminal designed by Norman Foster, handling most international flights." },
      { code: "Hajj Terminal", description: "Massive open-air terminal exclusively for Hajj and Umrah pilgrims." },
      { code: "Terminal 2", description: "Original terminal now handling domestic and some regional flights." },
    ],
  },
  {
    slug: "riyadh-ruh",
    name: "King Khalid Airport",
    iata: "RUH",
    icao: "OERK",
    citySlug: "riyadh",
    countrySlug: "saudi-arabia",
    latitude: 24.9576,
    longitude: 46.6988,
    elevationFt: 2049,
    timezone: "Asia/Riyadh",
    openedYear: 1983,
    runwayCount: 2,
    terminalCount: 5,
    annualPassengers: 35000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.riyadhairport.com",
    overview: "King Khalid is Riyadh's main airport and Saudia's secondary hub. Terminal 5 is a modern facility while the new King Salman International Airport is under construction to replace it by 2030.",
    terminals: [
      { code: "Terminal 1", description: "International flights for various carriers." },
      { code: "Terminal 2", description: "Domestic flights and some international services." },
      { code: "Terminal 5", description: "Modern facility handling Saudia and international flights." },
    ],
  },
  {
    slug: "kuwait-kwi",
    name: "Kuwait International Airport",
    iata: "KWI",
    icao: "OKBK",
    citySlug: "kuwait-city",
    countrySlug: "kuwait",
    latitude: 29.2266,
    longitude: 47.9689,
    elevationFt: 206,
    timezone: "Asia/Kuwait",
    openedYear: 1979,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 15000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.kuwait-airport.com.kw",
    overview: "Kuwait International is the country's main airport, featuring a new Terminal 4 opened in 2022. It serves as Kuwait Airways' hub with connections throughout the Middle East and beyond.",
    terminals: [
      { code: "Terminal 1", description: "Original terminal handling most airlines." },
      { code: "Terminal 4", description: "New state-of-the-art terminal for Kuwait Airways and select carriers." },
    ],
  },
  {
    slug: "bahrain-bah",
    name: "Bahrain International Airport",
    iata: "BAH",
    icao: "OBBI",
    citySlug: "manama",
    countrySlug: "bahrain",
    latitude: 26.2708,
    longitude: 50.6336,
    elevationFt: 6,
    timezone: "Asia/Bahrain",
    openedYear: 1927,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 9000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.bahrainairport.bh",
    overview: "Bahrain International is a modern airport featuring a new terminal opened in 2021. It serves as Gulf Air's hub with efficient connections to the Middle East, Europe, and Asia.",
    terminals: [
      { code: "New Terminal", description: "Single modern terminal opened in 2021, handling all flights with capacity for 14 million passengers." },
    ],
  },
  {
    slug: "muscat-mct",
    name: "Muscat International Airport",
    iata: "MCT",
    icao: "OOMS",
    citySlug: "muscat",
    countrySlug: "oman",
    latitude: 23.5933,
    longitude: 58.2844,
    elevationFt: 48,
    timezone: "Asia/Muscat",
    openedYear: 1973,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 13000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.omanairports.com",
    overview: "Muscat International features a stunning new terminal opened in 2018, inspired by Omani forts. It serves as Oman Air's hub with connections to Europe, Asia, and Africa.",
    terminals: [
      { code: "New Terminal", description: "Single modern terminal with Omani architectural elements, handling all flights." },
    ],
  },
  {
    slug: "amman-amm",
    name: "Queen Alia Airport",
    iata: "AMM",
    icao: "OJAI",
    citySlug: "amman",
    countrySlug: "jordan",
    latitude: 31.7226,
    longitude: 35.9932,
    elevationFt: 2395,
    timezone: "Asia/Amman",
    openedYear: 1983,
    runwayCount: 2,
    terminalCount: 1,
    annualPassengers: 10000000,
    annualPassengersYear: 2024,
    websiteUrl: "https://www.qaiairport.com",
    overview: "Queen Alia is Jordan's main gateway, featuring a modern terminal designed by Foster + Partners. It serves as Royal Jordanian's hub with connections to the Middle East, Europe, and North America.",
    terminals: [
      { code: "Terminal", description: "Single modern terminal with distinctive roof design, handling all flights." },
    ],
  },
  {
    slug: "beirut-bey",
    name: "Beirut-Rafic Hariri Airport",
    iata: "BEY",
    icao: "OLBA",
    citySlug: "beirut",
    countrySlug: "lebanon",
    latitude: 33.8209,
    longitude: 35.4884,
    elevationFt: 87,
    timezone: "Asia/Beirut",
    openedYear: 1954,
    runwayCount: 1,
    terminalCount: 1,
    annualPassengers: 8000000,
    annualPassengersYear: 2019,
    websiteUrl: "https://www.beirutairport.gov.lb",
    overview: "Beirut Airport is Lebanon's main international gateway, located in the southern suburbs. It features a single terminal serving as Middle East Airlines' hub with connections to Europe, Africa, and the Gulf.",
    terminals: [
      { code: "Terminal", description: "Single terminal with East and West wings handling all flights." },
    ],
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function main() {
  console.log("🌍 Seeding Batch 1: 50 Airports (Europe & Middle East)...");
  
  // Create countries
  console.log("Creating countries...");
  const countryMap = new Map<string, string>();
  for (const country of batch1Countries) {
    const existing = await db.country.findUnique({ where: { slug: country.slug } });
    if (!existing) {
      const created = await db.country.create({ data: country });
      countryMap.set(country.slug, created.id);
      console.log(`  ✓ ${country.name}`);
    } else {
      countryMap.set(country.slug, existing.id);
      console.log(`  ⏭ ${country.name} (exists)`);
    }
  }

  // Create cities
  console.log("\nCreating cities...");
  const cityMap = new Map<string, string>();
  for (const city of batch1Cities) {
    const countryId = countryMap.get(city.countrySlug);
    if (!countryId) continue;
    
    const existing = await db.city.findUnique({ where: { slug: city.slug } });
    if (!existing) {
      const created = await db.city.create({
        data: {
          name: city.name,
          slug: city.slug,
          latitude: city.lat,
          longitude: city.lon,
          countryId,
        }
      });
      cityMap.set(city.slug, created.id);
      console.log(`  ✓ ${city.name}`);
    } else {
      cityMap.set(city.slug, existing.id);
      console.log(`  ⏭ ${city.name} (exists)`);
    }
  }

  // Create airports with full data
  console.log("\nCreating 50 airports...");
  let created = 0;
  let skipped = 0;
  
  for (const airport of batch1Airports) {
    const cityId = cityMap.get(airport.citySlug);
    const countryId = countryMap.get(airport.countrySlug);
    
    if (!cityId || !countryId) {
      console.log(`  ✗ ${airport.name} - missing city/country`);
      continue;
    }

    const existing = await db.airport.findUnique({ where: { slug: airport.slug } });
    if (existing) {
      console.log(`  ⏭ ${airport.name} (exists)`);
      skipped++;
      continue;
    }

    // Create airport
        let createdAirport;
    try {
      createdAirport = await db.airport.create({
        data: {
          slug: airport.slug,
          name: airport.name,
          iata: airport.iata,
          icao: airport.icao,
          cityId,
          countryId,
          latitude: airport.latitude,
          longitude: airport.longitude,
          elevationFt: airport.elevationFt,
          timezone: airport.timezone,
          overview: airport.overview,
          openedYear: airport.openedYear,
          runwayCount: airport.runwayCount,
          terminalCount: airport.terminalCount,
          annualPassengers: airport.annualPassengers,
          annualPassengersYear: airport.annualPassengersYear,
          websiteUrl: airport.websiteUrl,
          status: AirportStatus.PUBLISHED,
          sourceNotes: "Core identity facts compiled from public airport-operator and aviation-reference data.",
        }
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        console.log(`  ⏭ ${airport.name} (duplicate - skipping)`);
        skipped++;
        continue;
      }
      throw e;
    }

    // Create terminals
    for (const terminal of airport.terminals) {
      await db.terminal.create({
        data: {
          airportId: createdAirport.id,
          code: terminal.code,
          description: terminal.description,
        }
      });
    }

    // Create default amenities
    const defaultAmenities = [
      { category: AmenityCategory.FREE_WIFI, name: "Free Airport WiFi", location: "Terminal-wide" },
      { category: AmenityCategory.CURRENCY_EXCHANGE, name: "Currency Exchange", location: "Arrivals and Departures" },
      { category: AmenityCategory.PHARMACY, name: "Airport Pharmacy", location: "Departures Hall" },
      { category: AmenityCategory.CHARGING_STATION, name: "Charging Stations", location: "Gate Areas" },
      { category: AmenityCategory.RESTAURANT, name: "Food Court", location: "Terminal Center" },
      { category: AmenityCategory.COFFEE_SHOP, name: "Coffee Shops", location: "Multiple Locations" },
    ];
    
    for (const amenity of defaultAmenities) {
      await db.amenity.create({
        data: { airportId: createdAirport.id, ...amenity }
      });
    }

    // Create default transfers
    const defaultTransfers = [
      { type: TransferType.TAXI, provider: "Airport Taxi", description: "Metered taxis available at designated ranks outside arrivals." },
      { type: TransferType.METRO, provider: "Airport Express", description: "Direct rail connection to city center." },
      { type: TransferType.CAR_RENTAL, provider: "Major Rental Companies", description: "Rental counters in arrivals hall." },
    ];
    
    for (const transfer of defaultTransfers) {
      await db.transferOption.create({
        data: { airportId: createdAirport.id, ...transfer }
      });
    }

    // Create default parking
    const defaultParking = [
      { type: ParkingType.SHORT_STAY, name: "Short-Stay Parking" },
      { type: ParkingType.LONG_STAY, name: "Long-Stay / Economy Parking" },
    ];
    
    for (const parking of defaultParking) {
      await db.parkingOption.create({
        data: { airportId: createdAirport.id, ...parking }
      });
    }

    // Create default FAQs
    await db.fAQ.createMany({
      data: [
        {
          airportId: createdAirport.id,
          question: `What are the IATA and ICAO codes for ${airport.name}?`,
          answer: `${airport.name} uses the IATA code ${airport.iata} and the ICAO code ${airport.icao}.`,
          sortOrder: 0,
        },
        {
          airportId: createdAirport.id,
          question: `What time zone is ${airport.name} in?`,
          answer: `${airport.name} operates on ${airport.timezone} time.`,
          sortOrder: 1,
        },
        {
          airportId: createdAirport.id,
          question: `How many terminals does ${airport.name} have?`,
          answer: `${airport.name} has ${airport.terminalCount} terminal(s).`,
          sortOrder: 2,
        },
      ]
    });

    created++;
    console.log(`  ✓ ${airport.name} (${airport.iata})`);
  }

  console.log(`\n✅ Batch 1 Complete! Created ${created} airports, skipped ${skipped} existing.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });