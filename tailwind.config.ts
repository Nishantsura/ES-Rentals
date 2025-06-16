import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-instrument-sans)", "system-ui"],
        heading: ["var(--font-inter)", "system-ui"],
        agrandir: ['Agrandir', 'sans-serif'],
        clash: ['ClashGrotesk', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      fontSize: {
        "heading-1": ["3rem", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.02em" }],
        "heading-2": ["2rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.02em" }],
        "heading-3": ["1.5rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.01em" }],
        "body": ["1rem", { lineHeight: "1.5", fontWeight: "500" }],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        "logo-animation": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "70%": { opacity: "1", transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "border-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(74, 222, 128, 0)" },
          "50%": { boxShadow: "0 0 0 4px rgba(74, 222, 128, 0.3)" }
        },
        "text-reveal": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "border-trace": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 0%" }
        },
        "glow-pulse": {
          "0%, 100%": { filter: "brightness(1) drop-shadow(0 0 0px rgba(74, 222, 128, 0.0))" },
          "50%": { filter: "brightness(1.15) drop-shadow(0 0 5px rgba(74, 222, 128, 0.7))" }
        },
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "subtle-scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-15%)" }
        }
      },
      animation: {
        "logo": "logo-animation 0.8s ease-out forwards",
        "logo-border": "border-pulse 3s ease-in-out infinite",
        "logo-text": "text-reveal 0.8s ease-out forwards 0.4s",
        "logo-shimmer": "shimmer 6s ease-in-out infinite",
        "logo-border-trace": "border-trace 3s linear infinite",
        "logo-glow": "glow-pulse 4s ease-in-out infinite",
        "scroll-x": "scroll-x 1200s ease-in-out infinite",
        "scroll-x-reverse": "scroll-x 1200s ease-in-out infinite reverse",
        "subtle-scroll-x": "subtle-scroll-x 2400s linear infinite"
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '200%': '200%',
        '400%': '400%'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
