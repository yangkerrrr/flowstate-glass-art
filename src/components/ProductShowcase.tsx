import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  accentColor: string;
}

const products: Product[] = [
  { id: 1, name: "Sol Hoodie", price: "$185", category: "Outerwear", accentColor: "from-stone-300/70 to-amber-200/50" },
  { id: 2, name: "Dawn Tee", price: "$89", category: "Essentials", accentColor: "from-amber-200/70 to-stone-300/50" },
  { id: 3, name: "Glow Pants", price: "$152", category: "Bottoms", accentColor: "from-stone-400/70 to-amber-100/50" },
  { id: 4, name: "Radiant Jacket", price: "$280", category: "Outerwear", accentColor: "from-amber-100/70 to-stone-300/50" },
  { id: 5, name: "Ember Shorts", price: "$95", category: "Bottoms", accentColor: "from-stone-300/70 to-amber-200/50" },
  { id: 6, name: "Zenith Cap", price: "$65", category: "Accessories", accentColor: "from-amber-200/70 to-stone-400/50" },
];

const ProductShowcase = () => {
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
      id="collection"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      {/* Floating background decorations with enhanced parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-20 right-[20%] w-40 h-20 liquid-glass-pill opacity-30"
          style={{ transform: `translateY(${scrollProgress * 120}px) rotate(${-10 + scrollProgress * 15}deg)` }}
        />
        <div 
          className="absolute bottom-40 left-[10%] w-24 h-24 liquid-glass rounded-full opacity-20"
          style={{ transform: `translateY(${-scrollProgress * 100}px) scale(${1 + scrollProgress * 0.15})` }}
        />
        <div 
          className="absolute top-1/3 right-[5%] w-16 h-16 liquid-glass rounded-2xl opacity-25"
          style={{ transform: `translateY(${scrollProgress * 80}px) rotate(${45 + scrollProgress * 30}deg)` }}
        />
      </div>

      {/* Section header */}
      <div className="container mx-auto px-6 mb-12">
        <div
          className={`flex items-end justify-between transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <span className="text-primary text-sm uppercase tracking-widest">Featured</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Current <span className="text-muted-foreground">Collection</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Products carousel */}
      <div className="container mx-auto px-6">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div
                  className={`group cursor-pointer transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  {/* Product card with liquid glass style */}
                  <div className="liquid-glass h-80 flex flex-col justify-between p-6 transition-all duration-500 group-hover:scale-[1.02]">
                    {/* Visual placeholder with colored accent */}
                    <div className="flex-1 flex items-center justify-center relative">
                      {/* Inner pill with color */}
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${product.accentColor} flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                        <span className="text-2xl font-bold text-foreground/90">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      
                      {/* Floating accent ring */}
                      <div className="absolute w-28 h-28 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                    </div>

                    {/* Product info */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {product.category}
                      </span>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-primary font-medium">{product.price}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="relative inset-auto translate-x-0 translate-y-0 bg-secondary/50 border-border hover:bg-secondary" />
            <CarouselNext className="relative inset-auto translate-x-0 translate-y-0 bg-secondary/50 border-border hover:bg-secondary" />
          </div>
        </Carousel>
      </div>

      {/* Background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/5 to-transparent blur-3xl pointer-events-none" />
    </section>
  );
};

export default ProductShowcase;
