import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, LogOut, User } from "lucide-react";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? "w-[90%] max-w-4xl" : "w-[95%] max-w-5xl"
      }`}
    >
      <div className="liquid-glass-pill px-6 py-3 flex items-center justify-between transition-all duration-500">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group transition-transform duration-300 hover:scale-105">
          <span className="text-2xl font-black tracking-tight text-primary">SOL</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {isHomePage ? (
            <>
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
            </>
          ) : (
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Home
            </Link>
          )}
          <Link
            to="/shop"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
          >
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            to="/checkout"
            className="relative p-2 hover:bg-secondary/50 rounded-full transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <button
                onClick={signOut}
                className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}

          {/* Shop Now CTA */}
          <Link to="/shop" className="hidden md:block">
            <Button variant="hero" size="sm">
              Shop Now
            </Button>
          </Link>

          {/* Mobile Menu */}
          <button className="md:hidden flex flex-col gap-1.5 p-2">
            <span className="w-5 h-px bg-foreground" />
            <span className="w-5 h-px bg-foreground" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
