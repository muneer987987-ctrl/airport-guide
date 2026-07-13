import Image from "next/image";
import { getCurrentWeather } from "@/lib/weather";

export async function WeatherWidget({ lat, lon }: { lat: number; lon: number }) {
  const weather = await getCurrentWeather(lat, lon);

  if (!weather) {
    return (
      <div className="card p-5 text-sm text-ink-500">
        <p className="eyebrow mb-2">Weather</p>
        <p>
          Live weather isn&apos;t connected yet — set <code className="font-mono text-xs">OPENWEATHER_API_KEY</code> to enable this widget.
        </p>
      </div>
    );
  }

  return (
    <div className="card flex items-center gap-4 p-5">
      {weather.iconUrl && (
        <Image src={weather.iconUrl} alt={weather.condition} width={56} height={56} />
      )}
      <div>
        <p className="eyebrow mb-1">Current weather</p>
        <p className="font-display text-2xl font-600">{weather.tempC}°C</p>
        <p className="text-sm text-ink-500">
          {weather.condition} · {weather.humidity}% humidity · {weather.windKph} km/h wind
        </p>
      </div>
    </div>
  );
}
