"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-black/5 transition-all duration-300">
      <div className="container mx-auto px-[4%] flex h-16 md:h-20 items-center justify-between">
        <Link 
          className="font-display font-bold tracking-tight text-xl z-50 group" 
          href="/" 
          onClick={closeMenu}
        >
          cherrycake<span className="text-gradient transition-all duration-300 group-hover:scale-110 inline-block">.</span>me
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#projects" 
            className="relative text-sm font-medium hover:text-cherry transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-cherry after:transition-all after:duration-300"
          >
            Projects
          </a>
          <a 
            href="#philosophy" 
            className="relative text-sm font-medium hover:text-cherry transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-cherry after:transition-all after:duration-300"
          >
            Philosophy
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:opacity-70 transition-all duration-200"
          aria-label="메뉴 토글"
        >
          <span 
            className={`w-6 h-0.5 bg-textGraphite transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span 
            className={`w-6 h-0.5 bg-textGraphite transition-all duration-300 ${
              isMenuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span 
            className={`w-6 h-0.5 bg-textGraphite transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 glass-dark md:hidden transition-all duration-500 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeMenu}
        >
          <nav 
            className={`flex flex-col items-center justify-center h-full gap-10 text-2xl transition-all duration-500 ${
              isMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <a 
              href="#projects" 
              className="font-display font-bold hover:text-cherry transition-all duration-200 hover:scale-110"
              onClick={closeMenu}
            >
              Projects
            </a>
            <a 
              href="#philosophy" 
              className="font-display font-bold hover:text-cherry transition-all duration-200 hover:scale-110"
              onClick={closeMenu}
            >
              Philosophy
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
