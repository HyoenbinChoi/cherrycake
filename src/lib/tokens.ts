// lib/tokens.ts - 디자인 토큰 시스템
export const tokens = {
  brand: {
    cherry: {
      jam: "bg-cherry-jam text-white",
      ring: "ring-2 ring-cherry",
    },
  },
  radius: {
    card: "rounded-2xl",
    chip: "rounded-xl",
  },
  typography: {
    h1: "font-display text-5xl leading-tight md:text-6xl tracking-tight",
    h2: "font-display text-3xl md:text-4xl tracking-tight",
    h3: "font-display text-2xl md:text-3xl tracking-tight",
    body: "font-sans text-[16px] leading-8 md:text-[17px] md:leading-8",
    mono: "font-mono tracking-[.02em] text-sm",
  },
  rhythm: {
    a: "py-20 md:py-24",
    b: "pt-24 pb-16 md:pt-32 md:pb-20",
  },
};
