import { useEffect, useRef, useState } from "react";

interface Product {
  id: number;
  name: string;
  nameJp: string;
  price: string;
  category: string;
}

const products: Product[] = [
  { id: 1, name: "Flux Hoodie", nameJp: "フラックス", price: "¥18,500", category: "Outerwear" },
  { id: 2, name: "Motion Tee", nameJp: "モーション", price: "¥8,900", category: "Essentials" },
  { id: 3, name: "Drift Pants", nameJp: "ドリフト", price: "¥15,200", category: "Bottoms" },
  { id: 4, name: "Wave Jacket", nameJp: "ウェーブ", price: "¥28,000", category: "Outerwear" },
];

const ProductShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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
      id="collection"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      {/* Section header */}
      <div className="container mx-auto px-6 mb-20">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-japanese text-primary text-sm">コレクション</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Current <span className="text-muted-foreground">Collection</span>
          </h2>
        </div>
      </div>

      {/* Products grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Product card */}
              <div className="glass glass-glow rounded-2xl p-6 h-80 flex flex-col justify-between transition-all duration-500 group-hover:scale-[1.02]">
                {/* Visual placeholder */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="w-24 h-24 rounded-2xl bg-secondary/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <span className="text-3xl font-bold text-primary/40">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Floating accent */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                    <span className="font-japanese text-xs text-muted-foreground">
                      {product.nameJp}
                    </span>
                  </div>
                  <p className="text-primary font-medium">{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/5 to-transparent blur-3xl pointer-events-none" />
    </section>
  );
};

export default ProductShowcase;
