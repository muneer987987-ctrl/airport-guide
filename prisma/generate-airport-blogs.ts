import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Auto-generates one blog article per airport, built entirely from data
 * already verified and stored in the database (overview, terminals,
 * lounges, hotels, transfers) — no new facts are introduced, this just
 * repackages existing verified content into readable long-form articles
 * for SEO purposes. Idempotent — safe to re-run.
 */

function formatMillions(n: number | null): string {
  if (!n) return "";
  return (n / 1_000_000).toFixed(1) + "M";
}

async function main() {
  const airports = await db.airport.findMany({
    where: { status: "PUBLISHED" },
    include: {
      city: true,
      country: true,
      terminals: true,
      lounges: true,
      hotels: true,
      transferOptions: true,
    },
  });

  for (const a of airports) {
    const slug = `${a.slug}-complete-travel-guide`;

    const terminalLines =
      a.terminals.length > 0
        ? a.terminals.map((t) => `**${t.code}**${t.description ? ` — ${t.description}` : ""}`).join("\n\n")
        : "Terminal information for this airport is being finalized.";

    const loungeLines =
      a.lounges.length > 0
        ? a.lounges.map((l) => `**${l.name}**${l.terminal ? ` (${l.terminal})` : ""}${l.accessRules ? ` — ${l.accessRules}` : ""}`).join("\n\n")
        : "";

    const hotelLines =
      a.hotels.length > 0
        ? a.hotels.map((h) => `**${h.name}**${h.distanceKm ? ` — ${h.distanceKm}km from the terminal` : ""}`).join("\n\n")
        : "";

    const transferLines = a.transferOptions.map((t) => `${t.type.replace("_", " ")}: ${t.description}`).join("\n\n");

    const content = `${a.name} (${a.iata}/${a.icao}) serves ${a.city.name}, ${a.country.name}, and this guide covers what you need to know before you fly.

## Overview

${a.overview}

## Terminals

${terminalLines}

## Getting to and from the airport

${transferLines}

${loungeLines ? `## Lounges\n\n${loungeLines}\n` : ""}
${hotelLines ? `## Nearby hotels\n\n${hotelLines}\n` : ""}
## Key facts

${a.name} operates on ${a.timezone} time${a.runwayCount ? ` and has ${a.runwayCount} runway${a.runwayCount > 1 ? "s" : ""}` : ""}${a.terminalCount ? `, with ${a.terminalCount} terminal${a.terminalCount > 1 ? "s" : ""}` : ""}.${a.annualPassengers ? ` The airport handles roughly ${formatMillions(a.annualPassengers)} passengers a year${a.annualPassengersYear ? ` (${a.annualPassengersYear} figures)` : ""}.` : ""}

For live flight status, current weather, and the full terminal-by-terminal guide, see the complete ${a.name} page.`;

    await db.blogPost.upsert({
      where: { slug },
      update: {
        title: `${a.name} (${a.iata}): Complete Travel Guide`,
        excerpt: `Everything you need to know about ${a.name} — terminals, transfers, and getting around ${a.iata}.`,
        content,
        metaTitle: `${a.name} (${a.iata}) Complete Guide 2026`,
        metaDescription: `A complete travel guide to ${a.name} in ${a.city.name}: terminals, transfers, lounges, and everything you need to know before you fly.`,
      },
      create: {
        slug,
        title: `${a.name} (${a.iata}): Complete Travel Guide`,
        excerpt: `Everything you need to know about ${a.name} — terminals, transfers, and getting around ${a.iata}.`,
        content,
        metaTitle: `${a.name} (${a.iata}) Complete Guide 2026`,
        metaDescription: `A complete travel guide to ${a.name} in ${a.city.name}: terminals, transfers, lounges, and everything you need to know before you fly.`,
      },
    });
    console.log(`Generated: ${a.name}`);
  }

  console.log(`Done — ${airports.length} airport guides generated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });