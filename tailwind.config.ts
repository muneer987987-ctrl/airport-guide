import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Runway / wayfinding inspired palette — not the default warm-cream/terracotta combo.
        ink: {
          50: "#f4f6f7",
          100: "#e3e8ea",
          200: "#c3ccd1",
          300: "#98a5ac",
          400: "#6d7c85",
          500: "#4e5d66",
          600: "#3a4750",
          700: "#2c3740",
          800: "#1c2429",
          900: "#0f1417",
          950: "#080b0d",
        },
        signal: {
          DEFAULT: "#ffb400", // taxiway centerline amber
          dim: "#cc9000",
        },
        beacon: {
          DEFAULT: "#1f6feb", // ILS glideslope blue
          dim: "#1a56b0",
        },
        go: "#1a8f5c",
        stop: "#c4432b",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0px",
      },
      fontWeight: {
        "500": "500",
        "600": "600",
        "700": "700",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  // baqi plugins...],
};

export default config;
