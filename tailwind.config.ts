import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#941A20",
          red: "#941A20",
        },
        secondary: {
          DEFAULT: "#0B0B0B",
          black: "#0B0B0B",
        },
        mist: "#F1EBEA",
        sage: "#4C1216",
        champagne: "#F7F5F3",
        ink: "#0B0B0B",
        sand: "#941A20",
        carmine: "#941A20",
        oxblood: "#4C1216",
        pine: "#4C1216",
        cognac: "#4C1216",
        ivory: "#F7F5F3",
        gold: "#941A20",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
