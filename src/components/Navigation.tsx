import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, LogOut, User, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? "w-[90%] max-w-4xl" : "w-[95%] max-w-5xl"
      }`}
    >
      <div className="liquid-glass-pill px-6 py-3 flex items-center justify-between transition-all duration-500">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group transition-transform duration-300 hover:scale-105">
          <span className="text-2xl font-black tracking-tight text-[hsl(var(--sol-mark))]">SOL</span>
          <span className="hidden lg:inline text-xs text-muted-foreground tracking-wide ml-2">
            Medicube Certified Reseller
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {isHomePage ? (
            <>
              {[
                { label: "Products", href: "#products" },
                { label: "Why Us", href: "#why-us" },
                { label: "Routines", href: "#routines" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                >
                  {item.label}
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
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <button
                onClick={async () => {
                  await signOut(true);
                }}
                className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
              <Link to="/auth">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
          )}

          {/* Shop Now CTA */}
          <Button asChild variant="hero" size="sm" className="hidden md:inline-flex">
            <Link to="/shop">Shop Medicube</Link>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
              <DrawerTrigger asChild>
                <button aria-label="Open menu" className="flex flex-col gap-1.5 p-2">
                  <span className="w-5 h-px bg-foreground" />
                  <span className="w-5 h-px bg-foreground" />
                </button>
              </DrawerTrigger>

              <DrawerContent>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <Link to="/" onClick={() => setMobileOpen(false)} className="text-lg font-black">
                      SOL
                    </Link>
                    <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="mt-4 flex flex-col gap-3">
                    {isHomePage ? (
                      [
                        { label: "Products", href: "#products" },
                        { label: "Why Us", href: "#why-us" },
                        { label: "Routines", href: "#routines" },
                      ].map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-base text-foreground/90"
                        >
                          {item.label}
                        </a>
                      ))
                    ) : (
                      <Link to="/" onClick={() => setMobileOpen(false)} className="text-base text-foreground/90">
                        Home
                      </Link>
                    )}
                  </nav>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link to="/shop" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      Shop Medicube
                    </Link>

                    {user ? (
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <Button asChild variant="outline" size="sm">
                            <Link to="/admin" onClick={() => setMobileOpen(false)}>
                              Admin
                            </Link>
                          </Button>
                        )}
                        <button
                          onClick={async () => {
                            await signOut(true);
                            setMobileOpen(false);
                          }}
                          className="p-2 hover:bg-secondary/50 rounded-full"
                        >
                          <LogOut className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <Button asChild variant="outline" size="sm">
                        <Link to="/auth" onClick={() => setMobileOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
