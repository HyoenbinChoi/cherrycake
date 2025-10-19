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
        // CSS 변수 연결 (다크모드 대응)
        ink: "hsl(var(--ink))",
        paper: "hsl(var(--paper))",
        accent: "hsl(var(--accent))",
      },
      keyframes: {
        pulseLine: {
          "0%": { transform: "translateX(-12%)", opacity: ".6" },
          "50%": { transform: "translateX(60%)", opacity: "1" },
          "100%": { transform: "translateX(112%)", opacity: ".6" },
        },
      },
      animation: { pulseLine: "pulseLine 3s cubic-bezier(.2,.8,.2,1) infinite" },
      borderRadius: { 
        xl: "1.25rem",   // 20px - 카드 기본
        "2xl": "1.75rem", // 28px - 시그니처 라운드
        "3xl": "2rem",    // 32px - 추가
      },
      boxShadow: { 
        highlight: "0 0 0 1px rgba(193,169,255,.9)",
        cherry: "0 10px 30px -10px rgba(225, 74, 92, 0.35)",
        soft: "0 8px 24px rgba(15, 15, 16, 0.08)",
        elevated: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(1200px 800px at 30% 20%, rgba(243, 239, 234, 0.4) 0%, transparent 60%), radial-gradient(1000px 600px at 70% 80%, rgba(243, 239, 234, 0.4) 0%, transparent 60%)",
        "cherry-jam":
          "linear-gradient(145deg, #E14A5C, #FF758C)",
        "gradient-cherry-peach":
          "linear-gradient(135deg, #E14A5C 0%, #F6B79E 100%)",
        "gradient-cyan-violet":
          "linear-gradient(135deg, #89E8E0 0%, #C1A9FF 100%)",
      },
      transitionTimingFunction: {
        "human-1": "cubic-bezier(.2,.7,.2,1)",
        "human-2": "cubic-bezier(.15,.8,.25,1)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-latin)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        human: "0.015em",
        tightHuman: "-0.005em",
        ui: "0.02em",
      },
      lineHeight: {
        comfy: "1.8",
        snug: "1.15",
        ui: "1.35",
      },
      fontWeight: {
        semid: "550",
      },
      fontSize: {
        "d-1": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }], // 60px
        "d-2": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.005em" }],    // 48px
        "h-1": ["2rem", { lineHeight: "1.2" }],                               // 32px
        "h-2": ["1.5rem", { lineHeight: "1.3" }],                             // 24px
        "b-1": ["1.0625rem", { lineHeight: "1.8", letterSpacing: "0.015em" }],// 17px 본문
        "b-2": ["0.9375rem", { lineHeight: "1.75" }],                         // 15px 보조
        "cap": ["0.92rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },
    },
  },
  plugins: [],
};
export default config;
