import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}", "./hooks/**/*.{js,ts,jsx,tsx}", "./context/**/*.{js,ts,jsx,tsx}", "./types/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--text)",
        muted: "var(--muted)",
        hairline: "var(--border)",
        cream: "var(--bg)",
        sand: {
          DEFAULT: "var(--sand)",
          strong: "var(--sand-strong)",
        },
        brand: {
          DEFAULT: "var(--primary)",
          strong: "var(--primary-strong)",
          soft: "var(--primary-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
