import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import HoodieModel from "./HoodieModel";

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
            background: 'radial-gradient(circle, hsl(220 20% 50% / 0.08) 0%, transparent 70%)',
            transform: `translateY(${scrollProgress * 100 + mousePosition.y * 20}px) translateX(${mousePosition.x * 15}px)`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, hsl(45 25% 75% / 0.06) 0%, transparent 70%)',
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
            background: 'linear-gradient(135deg, hsl(45 25% 90% / 0.7), hsl(220 15% 80% / 0.5))',
            transform: `translateY(${-scrollProgress * 90 + mousePosition.y * -8}px) translateX(${mousePosition.x * 6}px)`,
            boxShadow: '0 8px 32px hsl(45 25% 90% / 0.2)'
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
                Premium Apparel
              </div>

              {/* Main headline */}
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-gradient">Define</span>
                <br />
                <span className="text-foreground">Your</span>
                <br />
                <span className="text-muted-foreground">Style</span>
              </h1>

              {/* Subheadline */}
              <p
                className={`text-lg text-muted-foreground max-w-md mb-10 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                Minimal design. Maximum warmth. Apparel crafted for those who
                shine from within.
              </p>

              {/* CTAs with liquid glass style */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <Button variant="hero" size="lg">
                  Explore Collection
                </Button>
                <Button variant="hero-outline" size="lg">
                  Our Philosophy
                </Button>
              </div>
            </div>

            {/* Right - 3D Model */}
            <div 
              className="relative h-[450px] lg:h-[500px]"
              style={{
                transform: `translateY(${-scrollProgress * 50}px)`,
              }}
            >
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 liquid-glass rounded-3xl animate-pulse" />
                </div>
              }>
                <HoodieModel scrollProgress={scrollProgress} />
              </Suspense>

              {/* Decorative elements around 3D model */}
              <div className="absolute -bottom-4 -left-4 w-20 h-20 liquid-glass rounded-2xl opacity-60 float" />
              <div className="absolute top-10 -right-4 w-12 h-12 liquid-glass rounded-full opacity-40 float-delayed" />
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
