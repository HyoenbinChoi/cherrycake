// app/fonts.ts
import { Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

/** 영문 디스플레이: 약간 불규칙한 세리프로 인간적 톤 */
export const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "optional", // swap → optional로 변경: 폰트 없으면 system-ui 유지
  fallback: ["ui-serif", "Georgia", "serif"],
});

/** 한글 본문: Pretendard 지연 로드 전략 - 초기엔 system-ui */
export const sansKR = localFont({
  src: [
    // Variable 폰트만 사용 (2MB) - 나머지 제거로 1.5MB 절약
    { path: "../../public/fonts/pretendard/PretendardVariable.woff2", style: "normal", weight: "100 900" },
  ],
  variable: "--font-sans",
  display: "swap", // 초기 system-ui로 렌더 후 교체
  fallback: [
    "ui-sans-serif",
    "system-ui", 
    "-apple-system",
    "BlinkMacSystemFont",
    "Apple SD Gothic Neo",
    "Malgun Gothic",
    "sans-serif"
  ],
});

/** 코드/메타 */
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
