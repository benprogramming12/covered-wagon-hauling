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
        brand: {
          gold: "#C9960A",
          "gold-light": "#D4A017",
          "gold-pale": "#F5E6B0",
          brown: "#5C3010",
          "brown-dark": "#3D1F0A",
          green: "#2D5A27",
          "green-dark": "#1E3D1A",
          cream: "#FDF8F0",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
