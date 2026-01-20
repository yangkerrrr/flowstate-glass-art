import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import solLogo from "@/assets/sol-logo.png";

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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? "w-[90%] max-w-4xl" : "w-[95%] max-w-5xl"
      }`}
    >
      <div className={`liquid-glass-pill px-6 py-3 flex items-center justify-between transition-all duration-500`}>
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <img 
            src={solLogo} 
            alt="SOL" 
            className="h-6 w-auto transition-transform duration-300 group-hover:scale-110"
          />
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
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
        <Button variant="hero" size="sm" className="hidden md:flex">
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
