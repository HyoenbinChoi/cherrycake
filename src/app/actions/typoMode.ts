// app/actions/typoMode.ts
"use client";

export function setTypoMode(mode: "calm" | "expressive") {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-typo", mode);
}
