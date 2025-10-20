import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "cherrycake.me — Data meets Emotion",
  description: "패턴의 시대, 감각을 해석하다. 문화의 결을 분석하고, 추상화하고, 다시 조형화합니다.",
  keywords: ["Data Visualization", "AI", "Music Analysis", "Beethoven", "Große Fuge", "Portfolio", "Art", "Culture Analysis"],
  authors: [{ name: "cherrycake" }],
  creator: "cherrycake",
  metadataBase: new URL('https://cherrycake.me'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://cherrycake.me',
    siteName: 'cherrycake.me',
    title: 'cherrycake.me — Data × Emotion × AI',
    description: '패턴의 시대, 감각을 해석하다. 문화의 결을 분석하고, 추상화하고, 다시 조형화합니다.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'cherrycake.me - Data meets Emotion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cherrycake.me — Data × Emotion × AI',
    description: '패턴의 시대, 감각을 해석하다',
    images: ['/api/og'],
    creator: '@cherrycake',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark" data-typo="expressive">
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
