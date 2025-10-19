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
        <footer className="py-12 bg-ivory border-t border-black/5">
          <div className="container mx-auto px-[4%]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-neutral-600">
                © cherrycake.me · Resonant Architecture
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href="mailto:hyeonbinofficial@gmail.com" 
                  className="text-neutral-700 hover:text-cherry transition-colors duration-200"
                >
                  hyeonbinofficial@gmail.com
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
