import type { AmenityCategory } from "@prisma/client";

type AmenityRow = {
  id: string;
  category: AmenityCategory;
  name: string;
  location: string | null;
  hours: string | null;
};

const CATEGORY_LABELS: Record<AmenityCategory, string> = {
  DUTY_FREE: "Duty Free",
  RESTAURANT: "Restaurants",
  COFFEE_SHOP: "Coffee Shops",
  FAST_FOOD: "Fast Food",
  PRAYER_ROOM: "Prayer Rooms",
  SMOKING_AREA: "Smoking Areas",
  BABY_CARE_ROOM: "Baby Care Rooms",
  MEDICAL_FACILITY: "Medical Facilities",
  PHARMACY: "Pharmacy",
  CHARGING_STATION: "Charging Stations",
  FREE_WIFI: "Free WiFi",
  SIM_CARD_COUNTER: "SIM Card Counters",
  CURRENCY_EXCHANGE: "Currency Exchange",
  ATM: "ATMs",
  SLEEPING_AREA: "Sleeping Areas",
  CAPSULE_HOTEL: "Capsule Hotels",
  SHOWER: "Showers",
  SHOP: "Shops",
  PLAY_AREA: "Play Areas",
};

export function AmenityGrid({ amenities }: { amenities: AmenityRow[] }) {
  if (amenities.length === 0) {
    return <p className="text-sm text-ink-500">Amenity details for this airport are being verified and will appear here soon.</p>;
  }

  const grouped = amenities.reduce<Record<string, AmenityRow[]>>((acc, a) => {
    (acc[a.category] ??= []).push(a);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="card p-4">
          <h3 className="mb-2 font-display text-sm font-600">
            {CATEGORY_LABELS[category as AmenityCategory]}
          </h3>
          <ul className="space-y-1.5 text-sm text-ink-600 dark:text-ink-300">
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                {item.location && <span className="text-ink-400"> — {item.location}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
