import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        adriatic: "#1e6091",
        adriaticDark: "#143f60",
        terracotta: "#c1502e",
        sand: "#f4ead5",
        stone: "#e8dec5",
        ink: "#1b1b1b",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(20, 63, 96, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
