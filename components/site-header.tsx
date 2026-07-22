import Link from "next/link";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-ink-200 dark:border-ink-700">
      <div className="container-guide flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-signal" />
          <span className="font-display font-bold text-xl">Airport Guide</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-signal transition">Home</Link>
          <Link href="/search" className="text-sm font-medium hover:text-signal transition">Airports</Link>
          <Link href="/blog" className="text-sm font-medium hover:text-signal transition">Blog</Link>
          <Link href="/about" className="text-sm font-medium hover:text-signal transition">About</Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
          <nav className="container-guide py-4 flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium">Home</Link>
            <Link href="/search" className="text-sm font-medium">Airports</Link>
            <Link href="/blog" className="text-sm font-medium">Blog</Link>
            <Link href="/about" className="text-sm font-medium">About</Link>
          </nav>
        </div>
      )}
    </header>
  );
}