import Link from "next/link";
import { db } from "@/lib/db";
import { siteName } from "@/lib/utils";

const FEATURE_LINKS = [
  { href: "/airport-parking", label: "Airport Parking" },
  { href: "/airport-hotels", label: "Airport Hotels" },
  { href: "/airport-taxi", label: "Airport Taxi" },
  { href: "/airport-metro", label: "Airport Metro & Trains" },
  { href: "/airport-lounges", label: "Airport Lounges" },
  { href: "/airport-maps", label: "Airport Maps" },
  { href: "/airport-weather", label: "Airport Weather" },
  { href: "/airport-transfers", label: "Airport Transfers" },
  { href: "/airport-flight-status", label: "Live Flight Status" },
  { href: "/airport-currency-exchange", label: "Currency Exchange" },
  { href: "/airport-faqs", label: "Airport FAQs" },
];

export async function SiteFooter() {
  const countries = await db.country.findMany({
    orderBy: { name: "asc" },
    take: 12,
    select: { slug: true, name: true },
  });

  return (
    <footer className="mt-16 border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
      <div className="container-guide grid grid-cols-2 gap-8 py-12 text-sm sm:grid-cols-4">
        <div>
          <h3 className="eyebrow mb-3">Guides</h3>
          <ul className="space-y-2">
            {FEATURE_LINKS.slice(0, 6).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-600 hover:text-signal-dim dark:text-ink-300 dark:hover:text-signal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-3">More Guides</h3>
          <ul className="space-y-2">
            {FEATURE_LINKS.slice(6).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-600 hover:text-signal-dim dark:text-ink-300 dark:hover:text-signal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-3">Countries</h3>
          <ul className="space-y-2">
            {countries.map((c) => (
              <li key={c.slug}>
                <Link href={`/country/${c.slug}`} className="text-ink-600 hover:text-signal-dim dark:text-ink-300 dark:hover:text-signal">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-3">{siteName}</h3>
          <ul className="space-y-2 text-ink-600 dark:text-ink-300">
            <li><Link href="/blog">Travel Guides</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/sitemap.xml">Sitemap</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-200 py-4 text-center font-mono text-xs text-ink-400 dark:border-ink-800">
        © {new Date().getFullYear()} {siteName}. Flight and weather data from third-party providers; verify time-critical information with your airline.
      </div>
    </footer>
  );
}
