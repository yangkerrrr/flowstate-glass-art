import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import HoodieModel from "./HoodieModel";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 2), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[150vh] overflow-hidden">
      {/* Background with depth layers */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Layer 1 - Far background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(190 100% 60% / 0.15) 0%, transparent 70%)',
            transform: `translateY(${scrollProgress * 100}px)`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(280 80% 60% / 0.1) 0%, transparent 70%)',
            transform: `translateY(${scrollProgress * 50}px)`,
          }}
        />
      </div>

      {/* Layer 2 - Floating glass decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left pill */}
        <div 
          className="absolute top-32 left-[10%] w-24 h-12 liquid-glass-pill opacity-60"
          style={{ transform: `translateY(${scrollProgress * 80}px) rotate(${scrollProgress * 10}deg)` }}
        />
        
        {/* Bottom right circle */}
        <div 
          className="absolute bottom-40 right-[15%] w-16 h-16 liquid-glass rounded-full opacity-50"
          style={{ transform: `translateY(${-scrollProgress * 60}px)` }}
        />

        {/* Mid floating pill with accent */}
        <div 
          className="absolute top-1/2 left-[5%] w-32 h-14 liquid-glass-pill overflow-hidden opacity-40"
          style={{ transform: `translateY(${scrollProgress * 120}px)` }}
        >
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-accent/40" />
        </div>

        {/* Small accent circle */}
        <div 
          className="absolute top-[60%] right-[8%] w-10 h-10 rounded-full opacity-60"
          style={{ 
            background: 'linear-gradient(135deg, hsl(150 80% 50% / 0.8), hsl(180 80% 50% / 0.6))',
            transform: `translateY(${-scrollProgress * 90}px)`,
            boxShadow: '0 8px 32px hsl(160 80% 50% / 0.3)'
          }}
        />
      </div>

      {/* Sticky content container */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="relative z-20">
              {/* Japanese text accent */}
              <div
                className={`font-japanese text-sm text-primary mb-4 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                流れ状態 — State of Flow
              </div>

              {/* Main headline */}
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-gradient">Move</span>
                <br />
                <span className="text-foreground">Without</span>
                <br />
                <span className="text-muted-foreground">Limits</span>
              </h1>

              {/* Subheadline */}
              <p
                className={`text-lg text-muted-foreground max-w-md mb-10 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                Minimal design. Maximum intent. Apparel crafted for those who exist
                in perpetual motion.
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
              className="relative h-[600px] lg:h-[700px]"
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
