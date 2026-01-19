import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong py-3" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <svg
              viewBox="0 0 32 32"
              className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="16,4 28,24 16,20 4,24" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">FLOWSTATE</span>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Collection", "About", "Lookbook"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <Button variant="glass" size="sm" className="hidden md:flex">
          Shop Now
        </Button>

        {/* Mobile Menu */}
        <button className="md:hidden flex flex-col gap-1.5 p-2">
          <span className="w-5 h-px bg-foreground" />
          <span className="w-5 h-px bg-foreground" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
