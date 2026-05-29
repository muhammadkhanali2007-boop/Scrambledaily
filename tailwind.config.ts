import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "ui-sans-serif", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "hero-sm": ["2.5rem", { lineHeight: "1.12" }],
        hero: ["clamp(2.75rem,5vw,4.5rem)", { lineHeight: "1.1" }],
        "section-sm": ["1.75rem", { lineHeight: "1.2" }],
        section: ["clamp(1.875rem,3vw,3rem)", { lineHeight: "1.2" }],
      },
      colors: {
        luxe: {
          text: "var(--luxe-text-primary)",
          strong: "var(--luxe-text-strong)",
          secondary: "var(--luxe-text-secondary)",
          tertiary: "var(--luxe-text-tertiary)",
          surface: "var(--luxe-surface)",
          muted: "var(--luxe-surface-muted)",
          elevated: "var(--luxe-surface-elevated)",
          accent: "var(--luxe-accent)",
          "accent-mid": "var(--luxe-accent-mid)",
          "accent-soft": "var(--luxe-accent-soft)",
          success: "var(--luxe-success)",
          danger: "var(--luxe-danger)",
          border: "var(--luxe-border)",
          "border-strong": "var(--luxe-border-strong)",
        },
      },
      borderColor: {
        luxe: "var(--luxe-border)",
        "luxe-strong": "var(--luxe-border-strong)",
      },
      boxShadow: {
        soft: "0 1px 3px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04)",
        "soft-lg":
          "0 10px 40px -10px rgb(0 0 0 / 0.08), 0 4px 12px rgb(0 0 0 / 0.04)",
        luxe: "var(--luxe-shadow)",
        "luxe-soft": "var(--luxe-shadow-soft)",
        "luxe-inset": "var(--luxe-shadow-inset)",
      },
      borderRadius: {
        luxe: "var(--luxe-radius-xl)",
        "luxe-lg": "var(--luxe-radius-lg)",
        "luxe-md": "var(--luxe-radius-md)",
        "luxe-sm": "var(--luxe-radius-sm)",
        pill: "var(--luxe-radius-pill)",
      },
      transitionDuration: {
        luxe: "350ms",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
