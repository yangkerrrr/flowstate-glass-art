import { useEffect, useRef, useState } from "react";

const Philosophy = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Glass cards stack */}
            <div className="relative h-96 lg:h-[500px]">
              <div className="absolute top-8 left-8 w-64 h-80 glass rounded-3xl transform -rotate-6 opacity-60" />
              <div className="absolute top-4 left-4 w-64 h-80 glass rounded-3xl transform rotate-3 opacity-80" />
              <div className="absolute top-0 left-0 w-64 h-80 glass-strong rounded-3xl flex flex-col items-center justify-center p-8">
                <div className="font-japanese text-6xl text-primary mb-4">流</div>
                <div className="text-sm text-center text-muted-foreground">
                  Nagare — Flow
                </div>
                <div className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="mt-8 text-xs text-muted-foreground text-center leading-relaxed">
                  Embrace the state of flow, where movement becomes meditation
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-4 right-0 w-48 h-48 float-delayed">
                <div className="w-full h-full rounded-2xl glass flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient">2024</div>
                    <div className="text-xs text-muted-foreground mt-1">Collection</div>
                  </div>
                </div>
              </div>

              {/* Decorative ring */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 border border-primary/20 rounded-full animate-spin-slow" />
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { value: "100%", label: "Cotton" },
                { value: "Zero", label: "Waste" },
                { value: "∞", label: "Motion" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 600}ms` }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary">
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
