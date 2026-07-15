import Link from "next/link";
import { siteName } from "@/lib/utils";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container-guide max-w-2xl py-14">
      <h1 className="mb-6 font-display text-3xl font-700">Terms of Service</h1>
      <div className="space-y-5 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Use of this site</h2>
        <p>
          {siteName} provides general informational content about airports worldwide, including
          terminal guides, transfers, parking, and live flight/weather data sourced from
          third-party providers. This information is provided for convenience and general
          guidance only.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">No guarantee of accuracy</h2>
        <p>
          While we make reasonable efforts to keep information accurate and up to date, airport
          facilities, opening hours, transfer options, and prices change frequently. Always verify
          time-critical details (such as check-in times, gate information, and transit visa
          requirements) directly with your airline or the airport&apos;s official channels before
          traveling.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Third-party links and bookings</h2>
        <p>
          This site contains links to third-party booking and service providers, some of which are
          affiliate links. We are not responsible for the content, accuracy, or business practices
          of third-party sites, and any booking or purchase you make through them is subject to
          that provider&apos;s own terms.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Limitation of liability</h2>
        <p>
          {siteName} is not liable for any loss, missed flight, or other damage arising from
          reliance on information published on this site. Use of this site is at your own
          discretion.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes
          constitutes acceptance of the updated terms.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Contact</h2>
        <p>
  Questions about these terms can be sent via our <Link href="/contact" className="text-beacon underline">Contact page</Link>.
</p>
</div>
    </div>
  );
}