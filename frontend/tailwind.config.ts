import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AAINA BOUTIQUE brand palette
        cream: {
          50: "#FFFDF7",
          100: "#FFF9E6",
          200: "#FFF3CC",
          300: "#FFEDB3",
          400: "#FFE799",
          500: "#FFF8F0",
          DEFAULT: "#FFF8F0",
        },
        gold: {
          50: "#FFF9E6",
          100: "#FFE4A0",
          200: "#FFD700",
          300: "#DAA520",
          400: "#C5961E",
          500: "#B8860B",
          600: "#8B6914",
          DEFAULT: "#DAA520",
        },
        maroon: {
          50: "#FCE4EC",
          100: "#F8BBD0",
          200: "#C62828",
          300: "#B71C1C",
          400: "#880E4F",
          500: "#800020",
          600: "#6D001A",
          DEFAULT: "#800020",
        },
        // ShadCN required
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
        hindi: ["'Noto Sans Devanagari'", "sans-serif"],
      },
      fontSize: {
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "body-xl": ["1.25rem", { lineHeight: "1.875rem" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-33.33%)" },
        },
        "scroll-strip": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-strip-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 25s linear infinite",
        "scroll-strip": "scroll-strip 40s linear infinite",
        "scroll-strip-reverse": "scroll-strip-reverse 45s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
