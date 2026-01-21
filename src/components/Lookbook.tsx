import { useEffect, useRef, useState } from "react";

const looks = [
  { id: 1, title: "Urban Flow", season: "AW24", color: "from-slate-400/50 to-zinc-500/30" },
  { id: 2, title: "Night Drift", season: "AW24", color: "from-stone-400/50 to-neutral-500/30" },
  { id: 3, title: "Dawn Motion", season: "AW24", color: "from-zinc-400/50 to-slate-500/30" },
];

const Lookbook = () => {
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
      { threshold: 0.2 }
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
      id="lookbook"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      {/* Floating decorations with enhanced parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 left-[5%] w-20 h-20 liquid-glass rounded-full opacity-30"
          style={{ transform: `translateY(${scrollProgress * 70}px) scale(${1 + scrollProgress * 0.2})` }}
        />
        <div 
          className="absolute bottom-20 right-[10%] w-32 h-14 liquid-glass-pill opacity-25"
          style={{ transform: `translateY(${-scrollProgress * 90}px) rotate(${10 + scrollProgress * 20}deg)` }}
        />
        <div 
          className="absolute top-1/2 right-[3%] w-12 h-12 liquid-glass rounded-xl opacity-20"
          style={{ transform: `translateY(${scrollProgress * 100}px) rotate(${45 + scrollProgress * 45}deg)` }}
        />
      </div>

      <div className="container mx-auto px-6">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-primary text-sm uppercase tracking-widest">Gallery</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Look<span className="text-muted-foreground">book</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {looks.map((look, index) => (
            <div
              key={look.id}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              {/* Card */}
              <div className="relative aspect-[3/4] liquid-glass overflow-hidden">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${look.color} opacity-50 transition-opacity duration-500 group-hover:opacity-70`} />

                {/* Geometric elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-2 border-foreground/20 rounded-2xl transform rotate-45 transition-all duration-500 group-hover:rotate-[60deg] group-hover:scale-110" />
                    <div className="absolute inset-4 border border-foreground/10 rounded-xl transform -rotate-12 transition-all duration-500 group-hover:rotate-0" />
                    <div className="absolute inset-8 liquid-glass rounded-lg transition-all duration-500 group-hover:scale-110" />
                  </div>
                </div>

                {/* Floating mini elements */}
                <div className="absolute top-6 right-6 w-8 h-8 liquid-glass rounded-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-12 left-6 w-16 h-6 liquid-glass-pill opacity-40" />

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs text-primary uppercase tracking-wider">
                    {look.season}
                  </span>
                  <h3 className="text-xl font-semibold mt-1">{look.title}</h3>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
    </section>
  );
};

export default Lookbook;
