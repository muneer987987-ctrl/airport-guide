import { siteName } from "@/lib/utils";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="container-guide max-w-2xl py-14">
      <h1 className="mb-4 font-display text-3xl font-700">Contact Us</h1>
      <p className="mb-6 text-ink-600 dark:text-ink-300">
        Spotted outdated information, or have a correction, question, or partnership inquiry for{" "}
        {siteName}? We&apos;d like to hear from you.
      </p>
      <div className="card p-6">
        <p className="text-sm text-ink-500">Email us at</p>
        
          href="mailto:contact@yourairportguide.com"
          className="font-display text-xl font-600 text-beacon"
        >
          contact@yourairportguide.com
        </a>
        <p className="mt-4 text-xs text-ink-400">
          We aim to respond within a few business days. For urgent travel issues, please contact
          your airline or the airport directly — this is an independent information site, not an
          airport or airline.
        </p>
      </div>
    </div>
  );
}