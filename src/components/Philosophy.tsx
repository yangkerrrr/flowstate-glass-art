import { useEffect, useRef, useState } from "react";

const Philosophy = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height + 0.5));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      {/* Layered background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Far layer */}
        <div 
          className="absolute top-20 right-[5%] w-64 h-32 liquid-glass-pill opacity-20"
          style={{ transform: `translateY(${scrollProgress * 60}px) rotate(15deg)` }}
        />
        
        {/* Mid layer - rainbow pill like reference */}
        <div 
          className="absolute bottom-32 left-[8%] w-48 h-16 liquid-glass-pill overflow-hidden opacity-30"
          style={{ transform: `translateY(${-scrollProgress * 80}px)` }}
        >
          <div className="absolute inset-y-2 left-2 right-1/2 rounded-full bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-pink-400/60" />
        </div>

        {/* Plus button decoration */}
        <div 
          className="absolute top-1/2 right-[15%] w-14 h-14 liquid-glass rounded-full flex items-center justify-center opacity-40"
          style={{ transform: `translateY(${scrollProgress * 40}px)` }}
        >
          <span className="text-xl text-muted-foreground">+</span>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Glass cards stack with new style */}
            <div className="relative h-96 lg:h-[500px]">
              <div className="absolute top-12 left-12 w-64 h-80 liquid-glass rounded-3xl transform -rotate-6 opacity-40" />
              <div className="absolute top-6 left-6 w-64 h-80 liquid-glass rounded-3xl transform rotate-3 opacity-60" />
              <div className="absolute top-0 left-0 w-64 h-80 liquid-glass rounded-3xl flex flex-col items-center justify-center p-8">
                <div className="font-japanese text-6xl text-primary mb-4">流</div>
                <div className="text-sm text-center text-muted-foreground">
                  Nagare — Flow
                </div>
                <div className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="mt-8 text-xs text-muted-foreground text-center leading-relaxed">
                  Embrace the state of flow, where movement becomes meditation
                </div>
              </div>

              {/* Floating pill with green accent */}
              <div 
                className="absolute -bottom-4 right-8 w-48 h-20 liquid-glass-pill overflow-hidden float-delayed"
                style={{ transform: `translateY(${-scrollProgress * 30}px)` }}
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400/80 to-emerald-500/60" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
                  <div className="text-lg font-bold text-foreground">2024</div>
                  <div className="text-xs text-muted-foreground">Collection</div>
                </div>
              </div>

              {/* Decorative ring */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 border border-primary/20 rounded-full animate-spin-slow" />
            </div>
          </div>

          {/* Right - Content */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <span className="font-japanese text-primary text-sm">哲学</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-8">
              Our <span className="text-muted-foreground">Philosophy</span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Flowstate exists at the intersection of Japanese minimalism and
                contemporary streetwear. We believe clothing should move with
                you, not against you.
              </p>
              <p>
                Each piece is designed with intention—every seam, every cut,
                every detail serves a purpose. We strip away the unnecessary
                to reveal what matters: form that follows function.
              </p>
              <p>
                No faces. No personalities. Just pure design. Our garments
                speak for themselves, allowing you to project your own identity
                onto the canvas we provide.
              </p>
            </div>

            {/* Stats in liquid glass pills */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                { value: "100%", label: "Cotton", color: "from-cyan-400/60 to-blue-500/40" },
                { value: "Zero", label: "Waste", color: "from-green-400/60 to-emerald-500/40" },
                { value: "∞", label: "Motion", color: "from-purple-400/60 to-pink-500/40" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`liquid-glass-pill py-4 px-2 text-center transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 600}ms` }}
                >
                  <div className="text-xl md:text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
