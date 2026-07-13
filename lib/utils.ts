import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatMillions(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yourairportguide.com";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Airport Guide";
