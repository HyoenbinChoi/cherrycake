import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "cherrycake.me — Data meets Emotion",
  description: "Timeless interface.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
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
