import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { listActiveProducts, ProductRow } from "@/integrations/db/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  accentColor: string | null;
  imageUrl?: string | null;
}

// products now fetched from the database instead of being hardcoded


const ProductShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // fetch active products on mount
    (async () => {
      try {
        const data = await listActiveProducts();
        // transform rows to frontend-friendly shape
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            accentColor: p.accent_color ?? "from-slate-200/50 to-gray-100/50",
            imageUrl: p.image_url,
          }))
        );
      } catch (e) {
        console.error("Failed to load products for carousel", e);
      }
    })();
  }, []);

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
      id="products"
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
            <span className="text-primary text-sm uppercase tracking-widest">Medicube</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Featured <span className="text-muted-foreground">picks</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            Shop all →
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
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="block group"
                  >
                    <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-40 object-contain mb-4"
                        />
                      ) : (
                        <div className="h-40 bg-gray-100 flex items-center justify-center mb-4">
                          <span className="text-3xl font-bold text-foreground/70">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-primary font-medium">{`$${product.price}`}</p>
                    </div>
                  </Link>
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
