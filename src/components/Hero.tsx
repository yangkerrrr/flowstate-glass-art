import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] liquid-morph bg-gradient-radial from-primary/5 to-transparent" />
      </div>

      {/* 3D Product Visual */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none hidden lg:block">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Rotating ring */}
          <div className="absolute w-80 h-80 border border-primary/20 rounded-full animate-spin-slow" />
          <div className="absolute w-96 h-96 border border-primary/10 rounded-full animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
          
          {/* Central 3D element */}
          <div className="relative w-64 h-80 float">
            <div className="absolute inset-0 glass rounded-3xl transform rotate-6 opacity-60" />
            <div className="absolute inset-0 glass rounded-3xl -rotate-3 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gradient mb-2">FS</div>
                <div className="font-japanese text-sm text-muted-foreground">流れ状態</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
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

          {/* CTAs */}
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
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
