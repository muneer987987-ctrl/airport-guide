import Link from "next/link";
import { Plane, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink-900 text-white py-16">
      <div className="container-guide">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-6 h-6 text-signal" />
              <span className="font-display font-bold text-xl">Airport Guide</span>
            </div>
            <p className="text-ink-300 text-sm leading-relaxed">
              The most comprehensive airport guide on earth. 
              Helping travelers navigate 50+ airports worldwide.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-ink-300">
              <li><Link href="/search" className="hover:text-signal transition">All Airports</Link></li>
              <li><Link href="/blog" className="hover:text-signal transition">Blog</Link></li>
              <li><Link href="/airport-parking" className="hover:text-signal transition">Parking</Link></li>
              <li><Link href="/airport-hotels" className="hover:text-signal transition">Hotels</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-ink-300">
              <li><Link href="/about" className="hover:text-signal transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-signal transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-signal transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-signal transition">Terms</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center hover:bg-signal transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center hover:bg-signal transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center hover:bg-signal transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center hover:bg-signal transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink-400">
            © 2026 Airport Guide. All rights reserved.
          </p>
          <p className="text-sm text-ink-400">
            Made with ❤️ for travelers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}