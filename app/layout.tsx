import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdSlot } from "@/components/ad-slot";
import { organizationSchema, jsonLdScriptProps } from "@/lib/seo";
import { siteUrl, siteName } from "@/lib/utils";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Airport Guides for 10,000+ Airports Worldwide`,
    template: `%s | ${siteName}`,
  },
  description:
    "Terminal maps, lounges, parking, transfers, duty free, and live flight status for major airports worldwide.",
  robots: { index: true, follow: true },
  verification: {
    google: "iILC-mI3XzDFc-I1CDkOnKYNGXmaZs8A_8yotz_lqTc",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        <script {...jsonLdScriptProps([organizationSchema()])} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdSlot slot="HEADER" />
          <SiteHeader />
          <main>{children}</main>
          <AdSlot slot="MOBILE_STICKY" />
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
