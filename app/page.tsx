import Image from "next/image";
import Link from "next/link";
import { GlobalSearch } from "@/components/global-search";
import { db } from "@/lib/db";
import { ArrowRight, Plane, Globe, Map, Shield } from "lucide-react";

async function getFeaturedAirports() {
  return db.airport.findMany({
    where: { status: "PUBLISHED" },
    include: { city: true, country: true },
    orderBy: { annualPassengers: "desc" },
    take: 6,
  });
}

export default async function HomePage() {
  const airports = await getFeaturedAirports();

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
<section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-ink-900">
  {/* Animated Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-signal/20" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-signal/10 via-transparent to-transparent" />
  
  {/* Floating Elements Animation */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 left-10 w-72 h-72 bg-signal/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-beacon/5 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>
  
  {/* Grid Pattern Overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Hero Content */}
        <div className="relative z-10 container-guide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-signal/20 text-signal text-sm mb-6">
            <Plane className="w-4 h-4" />
            <span>Trusted by 1M+ travelers</span>
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Airport<br />
            <span className="text-signal">Companion</span>
          </h1>
          
          <p className="text-lg text-ink-200 max-w-2xl mx-auto mb-10">
            Terminal maps, lounges, parking, transfers, and live flight status 
            — everything you need before you fly.
          </p>
          
          <div className="max-w-xl mx-auto">
            <GlobalSearch />
          </div>
          
          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-ink-300">Popular:</span>
            {["LHR", "DXB", "JFK", "SIN", "HND"].map((code) => (
              <Link
                key={code}
                href={`/airport/${code.toLowerCase()}`}
                className="px-3 py-1 text-sm bg-white/10 text-white rounded-full hover:bg-signal transition"
              >
                {code}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-ink-800 py-8 border-y border-ink-700">
        <div className="container-guide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCard icon={<Plane />} number="50+" label="Airports" />
            <StatCard icon={<Globe />} number="36" label="Countries" />
            <StatCard icon={<Map />} number="40+" label="Guide Sections" />
            <StatCard icon={<Shield />} number="10K+" label="Global Coverage" />
          </div>
        </div>
      </section>

      {/* ===== FEATURED AIRPORTS ===== */}
      <section className="py-20 bg-white dark:bg-ink-900">
        <div className="container-guide">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
                Featured Airports
              </h2>
              <p className="mt-2 text-ink-500">Most visited guides</p>
            </div>
            <Link 
              href="/search" 
              className="flex items-center gap-2 text-signal hover:underline"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {airports.map((airport) => (
              <AirportCard key={airport.slug} airport={airport} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-20 bg-ink-50 dark:bg-ink-800">
        <div className="container-guide">
          <h2 className="font-display text-3xl font-bold text-center text-ink-900 dark:text-white mb-12">
            Everything You Need to Know
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Map />}
              title="Terminal Maps"
              description="Navigate complex terminals with detailed maps and directions."
            />
            <FeatureCard 
              icon={<Plane />}
              title="Lounges"
              description="Find the best lounges with access rules and amenities."
            />
            <FeatureCard 
              icon={<Globe />}
              title="Transfers"
              description="Taxi, metro, bus — all ground transport options covered."
            />
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-20 bg-signal">
        <div className="container-guide text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Never Miss a Flight Update
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Get airport tips, deals, and news delivered to your inbox.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-ink-900 outline-none"
            />
            <button className="px-6 py-3 bg-ink-900 text-white rounded-lg font-medium hover:bg-ink-800 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

/* ===== HELPER COMPONENTS ===== */

function StatCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-signal">{icon}</div>
      <div className="font-display text-2xl font-bold text-white">{number}</div>
      <div className="text-sm text-ink-300">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card p-6 hover:shadow-lg transition">
      <div className="w-12 h-12 rounded-lg bg-signal/10 flex items-center justify-center text-signal mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
      <p className="text-ink-500 text-sm">{description}</p>
    </div>
  );
}