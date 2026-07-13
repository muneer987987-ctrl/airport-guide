# Airport Guide

A production-architecture Next.js 15 airport guide platform, built to scale to 10,000+ airports.

This first deliverable is **not** a 50-airport or 10,000-airport catalogue — see
"Honest scope" below for why, and what to do next.

---

## Stack

Next.js 15 (App Router, React 19, TypeScript) · Tailwind CSS · Prisma ORM ·
PostgreSQL (Supabase) · ISR · Dynamic SEO metadata + JSON-LD · Sitemap index ·
robots.txt · Dark mode · Cookie-based admin auth.

## Getting started

```bash
npm install
cp .env.example .env      # fill in your real values (see below)
npx prisma db push        # create tables in your Supabase Postgres
npm run db:seed           # seed 8 real, deeply-populated airports + config rows
npx tsx prisma/seed-admin.ts you@example.com "a-strong-password"
npm run dev
```

Visit `http://localhost:3000` for the site, `http://localhost:3000/admin` for the admin panel.

> **Note on this sandbox:** I built and reviewed every file here, and `npm install`
> completed cleanly, but `prisma generate`/`validate` couldn't run in this
> environment because it needs `binaries.prisma.sh`, which isn't on this
> sandbox's allowed network list. That's a sandbox restriction, not a code
> issue — it will work normally with `npm install` on your machine or in CI/CD.
> Run `npx prisma generate` yourself as the first step after cloning.

## Environment variables you need to supply

All in `.env.example`, grouped by what they unlock:

| Variable | Powers |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Your Supabase Postgres connection |
| `FLIGHT_DATA_API_KEY` | Live arrivals/departures (AeroDataBox or FlightAware — see `lib/flights.ts`) |
| `OPENWEATHER_API_KEY` | Live weather widget (`lib/weather.ts`) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Interactive maps (not yet wired into a component — see Roadmap) |
| `ADMIN_SESSION_SECRET` | Signs admin login sessions — set a long random string |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense (per-slot unit IDs are managed in `/admin/ads`, not env vars) |
| `*_AFFILIATE_ID` | Local-dev fallback for each affiliate network — **production IDs belong in `/admin/affiliates`**, not env vars, so marketing can rotate them without a redeploy |

## Honest scope — what's real vs. what's scaffolded

The brief asked for 50 fully-detailed airports across ~80 data points each, with
a hard "no fake information" rule. Those two requirements are in tension: I
can't respond with the fabricated detail of a mocked prayer-room location, or
this year's exact duty-free vendor list, in prose from memory and call it
production data. So I made a deliberate trade:

- **Fully real, verifiable core facts** (IATA/ICAO codes, city/country,
  coordinates, timezone, runway/terminal counts, opening year) are seeded for
  **8 major airports**: LHR, DXB, JFK, CDG, SIN, HND, IST, DOH. Passenger
  totals are rounded, labeled with their year, and flagged as approximate —
  confirm against each airport's official annual report before relying on them.
- **Editorial/operational content** (terminal descriptions, starter amenities,
  transfer/parking categories, FAQs) is seeded with a genuinely useful but
  intentionally partial starting set per airport — not padded-out fake detail
  across all ~40 guide sections. The schema has a home for every section the
  brief listed (lounges, duty free, prayer rooms, capsule hotels, pet travel,
  transit visas, accessibility, etc.) — most just need real content added.
- **Live flight status and weather** are wired to real provider integrations
  (`lib/flights.ts`, `lib/weather.ts`) that return an honest "not configured"
  state rather than invented flight numbers — add your API keys to activate.
- **Affiliate links and ads** render nothing at all until a real ID is entered
  in `/admin` — there are no placeholder/dead links shown to visitors.

## What's built end-to-end

- **Database**: `prisma/schema.prisma` models every section in the brief —
  Airport, Terminal, Airline, Amenity (18 categories), Lounge, NearbyHotel,
  TransferOption, ParkingOption, TransitVisaInfo, LayoverGuide,
  AccessibilityInfo, PetTravelInfo, CustomsInfo, BaggageRules, SecurityRules,
  FAQ, LandingPage, AffiliateConfig, AdPlacement, AdminUser, and full
  Country/City geography.
- **Airport page** (`/airport/[slug]`): hero, overview/history, terminal guide,
  amenities grid, lounges, transfers, parking, hotels, layover guide,
  baggage/security/customs, accessibility/pet travel, tips, FAQs, live flight
  status sidebar, live weather sidebar, facts panel, emergency contacts,
  interleaved affiliate CTA blocks, ad slots.
- **SEO**: unique per-airport titles/descriptions/canonicals (`lib/seo.ts`),
  Airport/Breadcrumb/FAQ/Organization JSON-LD, chunked sitemap index that
  scales past 50,000 URLs per file as the catalogue grows, `robots.txt`.
- **Landing pages**: `/airport-parking`, `/airport-hotels`, `/airport-taxi`,
  `/airport-metro`, `/airport-lounges`, `/airport-maps`, `/airport-weather`,
  `/airport-transfers`, `/airport-flight-status`, `/airport-currency-exchange`,
  `/airport-faqs` — content-managed via the `LandingPage` table.
- **Search**: name / city / country / IATA / ICAO, at `/search`.
- **Country & city pages**: `/country/[slug]`, `/city/[slug]` for internal linking.
- **Affiliate library** (`lib/affiliates.ts`): deep-link builders for all 12
  networks named in the brief, DB-managed with env fallback.
- **Admin panel** (`/admin`, cookie-session auth): dashboard, airport list with
  publish-status control, per-airport core-content + SEO + FAQ editor,
  affiliate ID management, ad-slot management.
- **Dark mode**, responsive layout, `next/image` optimization, ISR
  (`revalidate = 3600` on catalogue pages).

## Roadmap to the full brief

1. **Expand the airport catalogue.** The seed script's shape (facts +
   terminals + amenities + transfers + parking + FAQs) is the template —
   repeat it per airport, sourcing each fact from the airport's official site
   or ICAO/IATA references, and set `dataVerifiedAt`/`sourceNotes` as you go.
   Batch this through the admin panel rather than bulk-pasting unverified prose.
2. **Admin CRUD breadth.** Airports/Affiliates/Ads have full CRUD now;
   Airlines, Lounges, Hotels, Transfers, Parking, and Landing Pages follow the
   exact same server-action pattern in `app/admin/actions.ts` — straightforward
   to extend.
3. **Interactive maps.** `NEXT_PUBLIC_MAPBOX_TOKEN` is scaffolded; add a
   `TerminalMap` component once you choose static floor-plan images vs. a live
   Mapbox GL embed per terminal.
4. **Auth hardening.** Current admin auth is a signed-cookie JWT suitable for
   a small editorial team; move to a proper provider (e.g. NextAuth/Clerk) if
   you need SSO, granular roles, or audit logs.
5. **Performance pass.** Once real content and images are in, run Lighthouse
   and tune image sizes/formats and ISR intervals per the brief's 95+ target.
