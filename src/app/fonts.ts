// app/fonts.ts
import { Instrument_Serif, IBM_Plex_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";

/** 영문 디스플레이: 약간 불규칙한 세리프로 인간적 톤 */
export const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

/** 한글 본문: Pretendard 로컬 (필수) + Inter(라틴) 폴백 */
export const sansKR = localFont({
  src: [
    { path: "../../public/fonts/pretendard/PretendardVariable.woff2", style: "normal", weight: "100 900" },
    { path: "../../public/fonts/pretendard/PretendardStd-Regular.woff2", style: "normal", weight: "400" },
    { path: "../../public/fonts/pretendard/PretendardStd-SemiBold.woff2", style: "normal", weight: "600" }
  ],
  variable: "--font-sans",
  display: "swap",
});

/** 라틴 본문 보정 (Pretendard 라틴 품질 보완) — 선택 */
export const sansLAT = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
});

/** 코드/메타 */
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});
