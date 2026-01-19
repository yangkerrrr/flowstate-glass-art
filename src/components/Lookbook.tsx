import { useEffect, useRef, useState } from "react";

const looks = [
  { id: 1, title: "Urban Flow", season: "AW24" },
  { id: 2, title: "Night Drift", season: "AW24" },
  { id: 3, title: "Dawn Motion", season: "AW24" },
];

const Lookbook = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      id="lookbook"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-japanese text-primary text-sm">ルックブック</span>
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
              <div className="relative aspect-[3/4] glass rounded-3xl overflow-hidden">
                {/* Abstract visual background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-3/4 h-3/4 rounded-full bg-gradient-radial from-primary/10 via-secondary/5 to-transparent transform transition-all duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Geometric elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border border-primary/30 rounded-2xl transform rotate-45 transition-all duration-500 group-hover:rotate-[60deg] group-hover:scale-110" />
                    <div className="absolute inset-4 border border-primary/20 rounded-xl transform -rotate-12 transition-all duration-500 group-hover:rotate-0" />
                    <div className="absolute inset-8 bg-primary/10 rounded-lg transition-all duration-500 group-hover:bg-primary/20" />
                  </div>
                </div>

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs text-primary uppercase tracking-wider">
                    {look.season}
                  </span>
                  <h3 className="text-xl font-semibold mt-1">{look.title}</h3>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-500" />
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
