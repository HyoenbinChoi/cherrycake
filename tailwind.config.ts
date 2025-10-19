import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: "4%" },
    extend: {
      colors: {
        graphite: "#0F0F10",
        slate: "#2B2D33",
        ivory: "#F3EFEA",
        textGraphite: "#1A1B1C",
        cyan: "#89E8E0",
        violet: "#C1A9FF",
        cherry: "#E14A5C",
        rose: "#FFADC6",
        peach: "#F6B79E",
      },
      keyframes: {
        pulseLine: {
          "0%": { transform: "translateX(-12%)", opacity: ".6" },
          "50%": { transform: "translateX(60%)", opacity: "1" },
          "100%": { transform: "translateX(112%)", opacity: ".6" },
        },
      },
      animation: { pulseLine: "pulseLine 3s cubic-bezier(.2,.8,.2,1) infinite" },
      borderRadius: { xl: "12px", "2xl": "16px" },
      boxShadow: { highlight: "0 0 0 1px rgba(193,169,255,.9)" },
      fontFamily: {
        sans: ["Noto Sans KR", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
