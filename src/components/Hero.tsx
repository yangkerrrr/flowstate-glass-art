import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 2), 1);
      setScrollProgress(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-[120vh] overflow-hidden">
      {/* Background with depth layers */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Layer 1 - Far background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, hsl(205 80% 52% / 0.12) 0%, transparent 70%)',
            transform: `translateY(${scrollProgress * 100 + mousePosition.y * 20}px) translateX(${mousePosition.x * 15}px)`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, hsl(198 92% 85% / 0.22) 0%, transparent 70%)',
            transform: `translateY(${scrollProgress * 50 + mousePosition.y * -15}px) translateX(${mousePosition.x * -20}px)`,
          }}
        />
      </div>

      {/* Layer 2 - Floating glass decorations with enhanced dynamics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left pill - floats with scroll & mouse */}
        <div 
          className="absolute top-32 left-[10%] w-24 h-12 liquid-glass-pill opacity-60 transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateY(${scrollProgress * 80 + mousePosition.y * 10}px) translateX(${mousePosition.x * 8}px) rotate(${scrollProgress * 10 + mousePosition.x * 5}deg)` 
          }}
        />
        
        {/* Bottom right circle */}
        <div 
          className="absolute bottom-40 right-[15%] w-16 h-16 liquid-glass rounded-full opacity-50 transition-transform duration-600 ease-out"
          style={{ 
            transform: `translateY(${-scrollProgress * 60 + mousePosition.y * -12}px) translateX(${mousePosition.x * -10}px) scale(${1 + scrollProgress * 0.1})` 
          }}
        />

        {/* Mid floating pill with accent */}
        <div 
          className="absolute top-1/2 left-[5%] w-32 h-14 liquid-glass-pill overflow-hidden opacity-40 transition-transform duration-700 ease-out"
          style={{ 
            transform: `translateY(${scrollProgress * 120 + mousePosition.y * 15}px) translateX(${mousePosition.x * 12}px)` 
          }}
        >
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/30" />
        </div>

        {/* Small accent circle - off-white glow */}
        <div 
          className="absolute top-[60%] right-[8%] w-10 h-10 rounded-full opacity-60 transition-transform duration-500 ease-out"
          style={{ 
            background: 'linear-gradient(135deg, hsl(198 92% 92% / 0.9), hsl(200 84% 34% / 0.20))',
            transform: `translateY(${-scrollProgress * 90 + mousePosition.y * -8}px) translateX(${mousePosition.x * 6}px)`,
            boxShadow: '0 10px 32px hsl(222 47% 11% / 0.10)'
          }}
        />

        {/* New floating elements for depth */}
        <div 
          className="absolute top-[20%] right-[25%] w-6 h-6 liquid-glass rounded-full opacity-30 transition-transform duration-800 ease-out"
          style={{ 
            transform: `translateY(${scrollProgress * 150 + mousePosition.y * 25}px) translateX(${mousePosition.x * -18}px)` 
          }}
        />
        <div 
          className="absolute bottom-[30%] left-[20%] w-20 h-8 liquid-glass-pill opacity-25 transition-transform duration-900 ease-out"
          style={{ 
            transform: `translateY(${-scrollProgress * 70 + mousePosition.y * -20}px) rotate(${-15 + scrollProgress * 20}deg)` 
          }}
        />
      </div>

      {/* Sticky content container */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="relative z-20">
              {/* Tagline */}
              <div
                className={`text-sm text-primary mb-4 tracking-widest uppercase transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <span className="text-[hsl(var(--sol-mark))]">SOL</span> • Medicube Certified Reseller
              </div>

              {/* Main headline */}
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-gradient">Clinic‑grade</span>
                <br />
                <span className="text-foreground">Medicube</span>
                <br />
                <span className="text-muted-foreground">favorites</span>
              </h1>

              {/* Subheadline */}
              <p
                className={`text-lg text-muted-foreground max-w-md mb-10 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                Authentic Medicube products, fast shipping, and friendly support—so your routine stays consistent.
              </p>

              {/* CTAs with liquid glass style */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <Button asChild variant="hero" size="lg">
                  <Link to="/shop">Shop Medicube</Link>
                </Button>
                <a href="#why-us">
                  <Button variant="hero-outline" size="lg">
                    Why buy from us
                  </Button>
                </a>
              </div>
            </div>

            {/* Right - Trust card */}
            <div 
              className="relative h-[450px] lg:h-[500px] flex items-center justify-center"
              style={{
                transform: `translateY(${-scrollProgress * 50}px)`,
              }}
            >
              <div className="w-full max-w-md">
                <div className="liquid-glass p-8 rounded-3xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4" />
                        Certified reseller
                      </div>
                      <h3 className="text-2xl font-bold mt-3">Shop with confidence</h3>
                    </div>
                    <div className="liquid-glass-pill px-4 py-2 text-xs text-muted-foreground">
                      Authentic inventory
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Authentic Medicube products</div>
                        <div className="text-sm text-muted-foreground">Sourced and sold as a certified reseller.</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Truck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Fast, trackable shipping</div>
                        <div className="text-sm text-muted-foreground">Order updates from checkout to delivery.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild variant="hero" size="sm">
                      <Link to="/shop">Browse products</Link>
                    </Button>
                    <a href="#products">
                      <Button variant="hero-outline" size="sm">Best sellers</Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Decorative elements around card */}
              <div className="absolute -bottom-4 -left-4 w-20 h-20 liquid-glass rounded-2xl opacity-50 float" />
              <div className="absolute top-10 -right-4 w-12 h-12 liquid-glass rounded-full opacity-35 float-delayed" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground z-20">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
