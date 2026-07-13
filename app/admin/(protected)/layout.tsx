import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/airports", label: "Airports" },
  { href: "/admin/affiliates", label: "Affiliate IDs" },
  { href: "/admin/ads", label: "Ads" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900 sm:block">
          <p className="mb-6 font-display text-sm font-700">Admin Panel</p>
          <nav className="space-y-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-3 py-2 text-sm text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="mt-8">
            <button className="text-xs text-stop">Sign out</button>
          </form>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
