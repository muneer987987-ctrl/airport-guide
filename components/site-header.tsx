import Link from "next/link";
import { GlobalSearch } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteName } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/airport-parking", label: "Parking" },
  { href: "/airport-hotels", label: "Hotels" },
  { href: "/airport-lounges", label: "Lounges" },
  { href: "/airport-transfers", label: "Transfers" },
  { href: "/airport-flight-status", label: "Flight Status" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90">
      <div className="container-guide flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-700 tracking-tight">
          <span className="text-signal">✈</span>
          {siteName}
        </Link>

        <nav className="hidden flex-1 items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <GlobalSearch compact />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
