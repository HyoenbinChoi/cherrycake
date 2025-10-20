import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-black/5 transition-all duration-300">
      <div className="container mx-auto px-[4%] flex h-16 md:h-20 items-center justify-between">
        <Link 
          className="font-display font-bold tracking-tight text-xl group" 
          href="/"
        >
          cherrycake<span className="text-gradient transition-all duration-300 group-hover:scale-110 inline-block">.</span>me
        </Link>

        {/* Desktop Navigation */}
        <nav className="flex items-center gap-4 md:gap-8">
          <a 
            href="#projects" 
            className="relative text-xs md:text-sm font-medium hover:text-cherry transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-cherry after:transition-all after:duration-300"
          >
            Projects
          </a>
          <a 
            href="#philosophy" 
            className="relative text-xs md:text-sm font-medium hover:text-cherry transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-cherry after:transition-all after:duration-300"
          >
            Philosophy
          </a>
        </nav>
      </div>
    </header>
  );
}
