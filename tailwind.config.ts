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
        background: "#0A0A0F",
        surface: "#141420",
        "surface-hover": "#1E1E30",
        border: "#2A2A40",
        gold: "#D4A843",
        "gold-light": "#F0D78C",
        success: "#34D399",
        warning: "#FBBF24",
        danger: "#F87171",
        info: "#60A5FA",
        "text-primary": "#F1F1F5",
        "text-secondary": "#8888A0",
        "text-muted": "#555570",
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
