import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const posts = [
  {
    slug: "how-early-should-you-arrive-at-the-airport",
    title: "How Early Should You Arrive at the Airport?",
    excerpt: "A practical, no-nonsense guide to timing your airport arrival for domestic and international flights.",
    content: `Nobody wants to spend three hours sitting at a gate — but missing a flight because you cut it too close is worse. Here's a realistic framework for timing your arrival.

## The general rule

For international flights, arrive 3 hours before departure. For domestic flights, 2 hours is usually enough. These aren't arbitrary numbers — they account for check-in, security, and the walk to your gate at a typical mid-sized airport.

## When to add extra time

Add 30-60 minutes on top of the general rule if any of these apply: you're flying from a mega-hub airport with long security lines (major hubs in the Gulf, the UK, or the US during peak season), you're checking bags with a budget airline that has an early bag-drop cutoff, you're traveling during a holiday period, or you need to clear a visa-on-arrival or additional document check before check-in.

## When you can cut it closer

If you have no checked luggage, you're already checked in online, and you're flying from a smaller regional airport with light traffic, arriving 90 minutes before a domestic flight is often fine. Just confirm your airline's specific check-in cutoff — many close bag drop 40-60 minutes before departure and gate boarding 20-30 minutes before, and they will not wait.

## The one thing that trips people up most

It's rarely security that causes people to miss flights — it's traffic to the airport, or underestimating immigration queues on arrival for an international connection. Build in buffer for the journey to the airport itself, not just the time inside it.`,
  },
  {
    slug: "how-to-survive-a-long-layover",
    title: "How to Survive a Long Layover: A Practical Guide",
    excerpt: "Stuck at an airport for 6+ hours? Here's how to actually make it work in your favor.",
    content: `A long layover feels like wasted time — but with a bit of planning, it doesn't have to be miserable.

## First, check your visa situation

Before you plan anything, confirm whether you're even allowed to leave the airport. Many countries offer transit visas or visa-free transit for a set number of hours, but the rules depend entirely on your nationality and the specific airport. Check your airline or the airport's official transit visa page before you fly — don't assume.

## If you're stuck airside

Most major airports now have real amenities worth using: sleep pods or rest zones, showers (sometimes free, sometimes paid), lounges accessible via Priority Pass or a day pass purchase even if you're not flying business class, and increasingly, mini attractions like gardens or observation decks. Check your specific airport's guide for what's actually available — it varies enormously between airports.

## If you can leave the airport

A layover of 6+ hours with a valid visa or visa-free transit option can be enough for a quick taste of the city — a landmark, a meal, a walk. Keep it simple: pick one thing, confirm the transfer time back to the airport with real traffic buffer, and get back through security well ahead of boarding. Store any luggage you don't want to carry, if the airport or city offers left-luggage facilities.

## The golden rule

Always add a buffer to your return-to-airport plan than you think you need. Immigration and security lines can be unpredictable, and missing a connection because a city excursion ran long is a bad trade for a few extra hours of sightseeing.`,
  },
  {
    slug: "understanding-airport-lounges",
    title: "Understanding Airport Lounges: Priority Pass, Paid Access, and What to Expect",
    excerpt: "Lounge access isn't just for business class passengers anymore. Here's how the different access routes actually work.",
    content: `Airport lounges used to be strictly for premium cabin passengers. That's changed — there are now several ways to get in, each with different rules.

## Airline-branded lounges

These are run by a specific airline (or their alliance partners) and are usually free for business/first class passengers on that airline, plus elite frequent-flyer tier holders even in economy. Access rules vary by alliance — Star Alliance, Oneworld, and SkyTeam each have their own tier-based lounge access policies, so check your specific status before assuming you qualify.

## Priority Pass and similar membership programs

Priority Pass is the best-known independent lounge access program — you pay an annual or per-visit fee (or get it as a credit card perk) and it grants access to a network of lounges regardless of airline or cabin class. Many airports have at least one Priority Pass-affiliated lounge, often run by operators like Plaza Premium, Marhaba, or similar regional groups.

## Pay-on-the-day access

Most lounges that accept Priority Pass also sell walk-in day passes directly, typically ranging from $30-60 depending on the airport and lounge quality. This is worth it if you have a long layover and want a quiet place to work, eat, or shower, even without lounge membership.

## What to actually expect

Don't expect a luxury experience everywhere — lounge quality varies hugely. Some are little more than a quiet room with snacks and WiFi; others (particularly flagship lounges at hub airports) offer full dining, showers, and even spa services. Check your specific airport's lounge listing before you fly if consistent quality matters to your layover plans.`,
  },
  {
    slug: "carry-on-liquid-rules-explained",
    title: "Carry-On Liquid Rules Explained (And Why They Still Trip People Up)",
    excerpt: "The 100ml rule seems simple until you're standing at security with a bag full of confiscated toiletries.",
    content: `Liquid restrictions have been standard at airports worldwide for years, but they still catch travelers out constantly. Here's what actually matters.

## The standard rule

Most countries follow a version of the same rule: liquids, gels, and aerosols in carry-on baggage must be in containers of 100ml (3.4oz) or less, and all containers must fit inside a single clear, resealable bag, usually around 20cm x 20cm or roughly one-litre capacity. This includes anything liquid or gel-like — toiletries, but also things people forget, like peanut butter, hummus, or lip balm in some jurisdictions.

## What counts as a "liquid" surprises people

Security screening definitions are broader than most travelers expect. Items like yogurt, jam, and some heavily gelled cosmetics are often treated as liquids even though they don't feel like ones. If in doubt, either pack it in checked luggage or check your specific departure airport's guidance in advance.

## Duty-free liquids on connecting flights

If you buy liquids at duty-free before a connecting flight, they're usually sealed in a tamper-evident bag with your receipt visible — do not open it before your final destination, or security at your connecting airport may confiscate the contents, since an opened bag can no longer be verified as untampered.

## A few practical tips

Pack your liquids bag somewhere easily accessible, since many airports still require it to be removed and screened separately. Travel-size containers are worth buying in advance rather than trying to decant liquids at the airport. And if you're flying multiple legs with different security rules (rare, but it happens on some regional routes), check the rules for your specific connecting airport rather than assuming they're identical everywhere.`,
  },
  {
    slug: "heathrow-to-central-london-transfer-options",
    title: "Heathrow to Central London: Comparing Your Transfer Options",
    excerpt: "Train, tube, or taxi? Here's how the main ways of getting from Heathrow into London actually compare.",
    content: `Heathrow sits about 14 miles west of central London, and you have several genuinely different ways to make that trip — the right one depends on your budget, luggage, and how much time you have.

## Heathrow Express

The fastest option by far, running non-stop from Heathrow to London Paddington in about 15 minutes. It's also the most expensive of the rail options. Worth it if you're short on time or connecting to a westbound onward train from Paddington.

## Elizabeth line

A more affordable rail option that also runs from Heathrow into central London, stopping at more stations along the way (including Paddington), making it useful if your final destination isn't near Paddington specifically. Journey times are a bit longer than Heathrow Express but the fare is meaningfully lower.

## Piccadilly line (London Underground)

The slowest but cheapest rail-based option, taking roughly 50-60 minutes to reach central London and stopping at many stations along the way. It's part of the regular Tube network, so if you already have an Oyster card or contactless payment method, it's a straightforward, no-fuss option — just not the fastest with luggage.

## Taxi or rideshare

The most convenient if you have significant luggage or are traveling as a group, since cost is often split across passengers rather than per-ticket. Journey time varies heavily with traffic — anywhere from 45 minutes to well over an hour during peak periods — and cost is significantly higher than any of the rail options.

## Which one should you actually pick?

If your final destination is directly served by a specific line, that usually settles it. Otherwise: choose Heathrow Express if time matters most, the Elizabeth line for a good balance of speed and cost, the Piccadilly line if you're traveling light and want to save money, and a taxi if you have heavy luggage or are traveling as a group where splitting the fare makes it cost-competitive.`,
  },
];

async function main() {
  for (const post of posts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`Published: ${post.title}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });