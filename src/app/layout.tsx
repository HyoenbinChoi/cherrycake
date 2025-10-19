import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { Noto_Sans_KR } from "next/font/google";

// 폰트 설정 - Noto Sans KR 단일 폰트 사용
const notoSansKR = Noto_Sans_KR({ 
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "cherrycake.me — Data meets Emotion",
  description: "Timeless interface.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main id="main">{children}</main>
        <footer className="py-10 bg-ivory border-t border-black/5">
          <div className="container mx-auto px-[4%] text-sm text-neutral-600">
            © cherrycake.me · Resonant Architecture
          </div>
        </footer>
      </body>
    </html>
  );
}
