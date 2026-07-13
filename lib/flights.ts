/**
 * Live flight status integration.
 *
 * IMPORTANT: This file intentionally contains NO hardcoded flight data.
 * Flight schedules change constantly, so arrivals/departures must always
 * come from a live provider. Wire up one of:
 *
 *   - AeroDataBox (via RapidAPI) — good free tier, simple REST API
 *   - FlightAware AeroAPI — more authoritative, paid
 *
 * Set FLIGHT_DATA_PROVIDER and FLIGHT_DATA_API_KEY in .env, then implement
 * the fetch call below. Until configured, callers should render the
 * "live status unavailable" empty state rather than fabricated rows.
 */

export type FlightStatusRow = {
  flightNumber: string;
  airline: string;
  origin?: string;
  destination?: string;
  scheduledTime: string; // ISO 8601
  estimatedTime?: string;
  status: "SCHEDULED" | "BOARDING" | "DEPARTED" | "LANDED" | "DELAYED" | "CANCELLED";
  gate?: string;
  terminal?: string;
};

export async function getDepartures(iata: string): Promise<FlightStatusRow[]> {
  const apiKey = process.env.FLIGHT_DATA_API_KEY;
  if (!apiKey) {
    // No provider configured — surface this explicitly instead of faking data.
    return [];
  }

  const provider = process.env.FLIGHT_DATA_PROVIDER ?? "aerodatabox";

  if (provider === "aerodatabox") {
    // Example shape only — confirm exact endpoint/params against current
    // AeroDataBox docs before enabling in production.
    const res = await fetch(
      `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iata}/departures`,
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
        },
        next: { revalidate: 60 }, // live data, short cache
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return mapAeroDataBoxDepartures(data);
  }

  // FlightAware AeroAPI branch left for implementation once credentials exist.
  return [];
}

export async function getArrivals(iata: string): Promise<FlightStatusRow[]> {
  const apiKey = process.env.FLIGHT_DATA_API_KEY;
  if (!apiKey) return [];
  // Mirror of getDepartures — implement against chosen provider's arrivals endpoint.
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAeroDataBoxDepartures(raw: any): FlightStatusRow[] {
  if (!raw?.departures) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.departures.map((f: any) => ({
    flightNumber: f.number,
    airline: f.airline?.name ?? "Unknown",
    destination: f.arrival?.airport?.iata,
    scheduledTime: f.departure?.scheduledTime?.utc,
    estimatedTime: f.departure?.revisedTime?.utc,
    status: (f.status ?? "SCHEDULED").toUpperCase(),
    gate: f.departure?.gate,
    terminal: f.departure?.terminal,
  }));
}
