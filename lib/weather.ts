export type WeatherSnapshot = {
  tempC: number;
  condition: string;
  iconUrl: string;
  humidity: number;
  windKph: number;
};

/**
 * Fetches current weather for an airport's coordinates via OpenWeatherMap.
 * Returns null (never fabricated data) when OPENWEATHER_API_KEY is unset
 * or the request fails — the WeatherWidget component renders an
 * "unavailable" state in that case.
 */
export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<WeatherSnapshot | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 900 } } // 15 min cache
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      tempC: Math.round(data.main.temp),
      condition: data.weather?.[0]?.main ?? "—",
      iconUrl: data.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        : "",
      humidity: data.main.humidity,
      windKph: Math.round(data.wind.speed * 3.6),
    };
  } catch {
    return null;
  }
}
