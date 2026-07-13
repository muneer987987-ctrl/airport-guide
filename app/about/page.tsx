import { siteName } from "@/lib/utils";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-guide max-w-2xl py-14">
      <h1 className="mb-4 font-display text-3xl font-700">About {siteName}</h1>
      <p className="text-ink-600 dark:text-ink-300">
        {siteName} is an independent airport guide covering terminals, transfers, parking,
        lounges, and live flight status. We link to official airport sources throughout each
        guide, and core airport facts are checked against public airport-operator data.
      </p>
    </div>
  );
}
