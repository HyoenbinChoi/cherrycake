import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { Inter, Noto_Sans_KR, Space_Grotesk, JetBrains_Mono } from "next/font/google";

// 폰트 설정
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({ 
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "cherrycake.me — Data meets Emotion",
  description: "Timeless interface.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKR.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
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
