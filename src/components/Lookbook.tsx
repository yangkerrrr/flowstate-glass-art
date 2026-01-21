import { useEffect, useRef, useState } from "react";

const looks = [
  { id: 1, title: "Urban Flow", season: "SL26", color: "from-slate-400/50 to-zinc-500/30" },
  { id: 2, title: "Night Drift", season: "SL26", color: "from-stone-400/50 to-neutral-500/30" },
  { id: 3, title: "Dawn Motion", season: "SL26", color: "from-zinc-400/50 to-slate-500/30" },
];

const Lookbook = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revealedId, setRevealedId] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.2 }
    );

    sectionRef.current && observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height + 0.5));
      setScrollProgress(progress);
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
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-[5%] w-20 h-20 liquid-glass rounded-full opacity-30"
          style={{ transform: `translateY(${scrollProgress * 70}px)` }}
        />
        <div
          className="absolute bottom-20 right-[10%] w-32 h-14 liquid-glass-pill opacity-25"
          style={{ transform: `translateY(${-scrollProgress * 90}px) rotate(${10 + scrollProgress * 20}deg)` }}
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
          {looks.map((look, index) => {
            const isLive = look.id === 1;
            const isRevealed = revealedId === 1;

            return (
              <div
                key={look.id}
                className={`group transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                } ${
                  revealedId === 1 && look.id !== 1 ? "opacity-40 blur-[1px]" : ""
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
                onClick={() => isLive && setRevealedId(1)}
              >
                <div className="relative aspect-[3/4] liquid-glass overflow-hidden cursor-pointer">
                  {/* === MULTI-LAYER CARD FAN (LOOK #1 ONLY) === */}
                  {isLive && (
                    <>
                      <div
                        className="absolute inset-0 z-30 transition-transform duration-700 ease-out"
                        style={{
                          background: "linear-gradient(to bottom right, rgba(255,255,255,0.08), transparent)",
                          transform: isRevealed
                            ? "translate(60px, -80px) rotate(8deg)"
                            : "translate(0,0)",
                        }}
                      />
                      <div
                        className="absolute inset-0 z-20 transition-transform duration-700 delay-100 ease-out"
                        style={{
                          background: "linear-gradient(to bottom right, rgba(255,255,255,0.12), transparent)",
                          transform: isRevealed
                            ? "translate(-70px, 10px) rotate(-6deg)"
                            : "translate(0,0)",
                        }}
                      />
                      <div
                        className="absolute inset-0 z-10 transition-transform duration-700 delay-200 ease-out"
                        style={{
                          background: "linear-gradient(to bottom right, rgba(255,255,255,0.16), transparent)",
                          transform: isRevealed
                            ? "translate(40px, 90px) rotate(4deg)"
                            : "translate(0,0)",
                        }}
                      />
                    </>
                  )}

                  {/* === PLACEHOLDER IMAGE (ONLY AFTER REVEAL) === */}
                  {isLive && (
                    <img
                      src="/placeholder.svg"
                      alt="Product placeholder"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        isRevealed ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  )}

                  {/* === ORIGINAL CARD CONTENT === */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isRevealed ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${look.color} opacity-50`} />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 border-2 border-foreground/20 rounded-2xl rotate-45" />
                        <div className="absolute inset-4 border border-foreground/10 rounded-xl -rotate-12" />
                        <div className="absolute inset-8 liquid-glass rounded-lg" />
                      </div>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-xs text-primary uppercase tracking-wider">
                        {look.season}
                      </span>
                      <h3 className="text-xl font-semibold mt-1">{look.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
    </section>
  );
};

export default Lookbook;
