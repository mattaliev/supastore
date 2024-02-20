import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        telegram: {
          "bg-color": "var(--tg-theme-background-color)",
          "text-color": "var(--tg-theme-text-color, #000000)",
          "hint-color": "var(--tg-theme-hint-color, #707579)",
          "link-color": "var(--tg-theme-link-color, #3390ec)",
          "button-color": "var(--tg-theme-button-color, #3390ec)",
          "button-text-color": "var(--tg-theme-button-text-color, #ffffff)",
          "secondary-bg-color": "var(--tg-theme-secondary-background-color, #f4f4f5)",
          "header-bg-color": "var(--tg-theme-header-bg-color, #ffffff)",
          "accent-text-color": "var(--tg-theme-accent-text-color, #3390ec)",
          "section-bg-color": "var(--tg-theme-section-bg-color, #ffffff)",
          "section-header-text-color": "var(--tg-theme-section-header-text-color, #000000)",
          "suitable-text-color": "var(--tg-theme-suitable-text-color, #000000)",
          "destructive-text-color": "var(--tg-theme-destructive-text-color, #ff3b30)",
        }
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
