import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sea: {
          50:  "#eaf6fb",
          100: "#cee9f3",
          200: "#9ad2e6",
          300: "#5fb6d4",
          400: "#2f97bd",
          500: "#1379a3",
          600: "#0a6184",
          700: "#084c69",
          800: "#063a51",
          900: "#04293b",
        },
        sand: {
          50:  "#fdf8ee",
          100: "#f7edcf",
          200: "#efd99a",
          300: "#e6c163",
          400: "#dba93d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
