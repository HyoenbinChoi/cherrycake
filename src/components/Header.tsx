"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-ivory/90 border-b border-black/5">
      <div className="container mx-auto px-[4%] flex h-16 md:h-20 items-center justify-between">
        <Link className="font-semibold tracking-tight text-lg z-50" href="/" onClick={closeMenu}>
          cherrycake<span className="text-cherry">.</span>me
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#projects" className="hover:underline underline-offset-4">
            Projects
          </a>
          <a href="#philosophy" className="hover:underline underline-offset-4">
            Philosophy
          </a>
          <a href="#about" className="hover:underline underline-offset-4">
            About
          </a>
          <a 
            href="#contact" 
            className="rounded-xl bg-gradient-to-r from-cherry to-peach text-white px-4 py-2 font-medium hover:brightness-105 transition-all"
          >
            Start a Project
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:opacity-70 transition-opacity"
          aria-label="메뉴 토글"
        >
          <span 
            className={`w-6 h-0.5 bg-textGraphite transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span 
            className={`w-6 h-0.5 bg-textGraphite transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
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
          className={`fixed inset-0 bg-ivory/95 backdrop-blur-lg md:hidden transition-all duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeMenu}
        >
          <nav 
            className={`flex flex-col items-center justify-center h-full gap-8 text-2xl transition-transform duration-300 ${
              isMenuOpen ? "scale-100" : "scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <a 
              href="#projects" 
              className="hover:text-cherry transition-colors"
              onClick={closeMenu}
            >
              Projects
            </a>
            <a 
              href="#philosophy" 
              className="hover:text-cherry transition-colors"
              onClick={closeMenu}
            >
              Philosophy
            </a>
            <a 
              href="#about" 
              className="hover:text-cherry transition-colors"
              onClick={closeMenu}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="rounded-xl bg-gradient-to-r from-cherry to-peach text-white px-6 py-3 font-medium hover:brightness-105 transition-all"
              onClick={closeMenu}
            >
              Start a Project
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
