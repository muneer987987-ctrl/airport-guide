/**
 * Live flight status integration — AeroDataBox via RapidAPI.
 *
 * IMPORTANT: This file intentionally contains NO hardcoded flight data.
 * If FLIGHT_DATA_API_KEY isn't set, or the provider call fails, functions
 * return an empty array and the UI shows an honest "unavailable" state
 * rather than fabricated rows.
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

type AeroDataBoxFlight = {
  number: string;
  airline?: { name?: string };
  status?: string;
  departure?: {
    airport?: { iata?: string };
    scheduledTime?: { utc?: string };
    revisedTime?: { utc?: string };
    gate?: string;
    terminal?: string;
  };
  arrival?: {
    airport?: { iata?: string };
    scheduledTime?: { utc?: string };
    revisedTime?: { utc?: string };
    gate?: string;
    terminal?: string;
  };
};

type AeroDataBoxResponse = {
  departures?: AeroDataBoxFlight[];
  arrivals?: AeroDataBoxFlight[];
};

/** Formats a Date as the local-time string AeroDataBox expects: YYYY-MM-DDTHH:mm */
function toLocalParam(date: Date): string {
  return date.toISOString().slice(0, 16);
}

async function fetchAeroDataBoxWindow(iata: string): Promise<AeroDataBoxResponse | null> {
  const apiKey = process.env.FLIGHT_DATA_API_KEY;
  if (!apiKey) return null;

  const now = new Date();
  const later = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6-hour window (free-tier friendly)
  const from = toLocalParam(now);
  const to = toLocalParam(later);

  const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iata}/${from}/${to}?withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=false`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
      },
      next: { revalidate: 300 }, // 5 min cache — respects free-tier rate limits
    });
    if (!res.ok) return null;
    return (await res.json()) as AeroDataBoxResponse;
  } catch {
    return null;
  }
}

function mapFlight(f: AeroDataBoxFlight, kind: "departure" | "arrival"): FlightStatusRow {
  const leg = kind === "departure" ? f.departure : f.arrival;
  const otherLeg = kind === "departure" ? f.arrival : f.departure;
  return {
    flightNumber: f.number,
    airline: f.airline?.name ?? "Unknown",
    destination: kind === "departure" ? otherLeg?.airport?.iata : undefined,
    origin: kind === "arrival" ? otherLeg?.airport?.iata : undefined,
    scheduledTime: leg?.scheduledTime?.utc ?? "",
    estimatedTime: leg?.revisedTime?.utc,
    status: normalizeStatus(f.status),
    gate: leg?.gate,
    terminal: leg?.terminal,
  };
}

function normalizeStatus(raw?: string): FlightStatusRow["status"] {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("cancel")) return "CANCELLED";
  if (s.includes("delay")) return "DELAYED";
  if (s.includes("depart") || s.includes("gateout") || s.includes("airborne")) return "DEPARTED";
  if (s.includes("land") || s.includes("arriv")) return "LANDED";
  if (s.includes("board")) return "BOARDING";
  return "SCHEDULED";
}

export async function getDepartures(iata: string): Promise<FlightStatusRow[]> {
  const data = await fetchAeroDataBoxWindow(iata);
  if (!data?.departures) return [];
  return data.departures.map((f) => mapFlight(f, "departure"));
}

export async function getArrivals(iata: string): Promise<FlightStatusRow[]> {
  const data = await fetchAeroDataBoxWindow(iata);
  if (!data?.arrivals) return [];
  return data.arrivals.map((f) => mapFlight(f, "arrival"));
}