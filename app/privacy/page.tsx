import Link from "next/link";
import { siteName } from "@/lib/utils";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-guide max-w-2xl py-14">
      <h1 className="mb-6 font-display text-3xl font-700">Privacy Policy</h1>
      <div className="space-y-5 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Information we collect</h2>
        <p>
          {siteName} does not require account creation to browse airport guides. We may collect
          basic, non-identifying analytics data (such as pages visited and general location) to
          understand how the site is used and to improve it.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Cookies</h2>
        <p>
          We may use cookies for site functionality (such as remembering your dark mode
          preference) and, where enabled, for advertising and affiliate tracking purposes. Third
          parties we link to or embed content from (such as affiliate booking partners or
          advertising networks) may set their own cookies subject to their own privacy policies.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Affiliate links</h2>
        <p>
          Some links on this site are affiliate links. If you make a booking or purchase through
          one of these links, we may earn a commission at no additional cost to you. This does
          not influence the factual airport information we publish.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Third-party services</h2>
        <p>
          We use third-party services for live flight status and weather data, and may use Google
          AdSense for advertising. These services operate under their own privacy policies.
        </p>

        <h2 className="font-display text-lg font-600 text-ink-900 dark:text-white">Contact</h2>
        <p>
          Questions about this policy can be sent via our <Link href="/contact" className="text-beacon underline">Contact page</Link>.
        </p>
      </div>
    </div>
  );
}