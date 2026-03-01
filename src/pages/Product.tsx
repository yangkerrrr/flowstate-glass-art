import { useParams, Link } from "react-router-dom";
// using manual fetch instead of react-query for simplicity
import { getProduct } from "@/integrations/db/client";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Awaited<ReturnType<typeof getProduct>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gallery, setGallery] = useState<string[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProduct(id)
      .then((p) => setProduct(p))
      .catch((e) => console.error("Failed to load product", e))
      .finally(() => setIsLoading(false));
  }, [id]);

  // whenever product changes, build a simple gallery array
  useEffect(() => {
    if (product) {
      setGallery(product.image_url ? [product.image_url] : []);
    } else {
      setGallery([]);
    }
  }, [product]);

  // scroll progress for decorative parallax
  useEffect(() => {
    const handleScroll = () => {
      const rect = document.body.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 2)));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-32 text-center">
          <p>Loading…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-32 text-center">
          <p>Product not found.</p>
          <Link to="/shop" className="text-primary underline">
            Back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      {/* floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-[5%] w-24 h-24 liquid-glass rounded-full opacity-20"
          style={{
            transform: `translateY(${scrollProgress * 80}px)`,
          }}
        />
        <div
          className="absolute bottom-20 right-[15%] w-32 h-16 liquid-glass-pill opacity-15"
          style={{
            transform: `translateY(${-scrollProgress * 100}px) rotate(${scrollProgress * 25}deg)`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-32">
        <Link to="/shop" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to shop
        </Link>

        <div className="mt-12 flex flex-col md:flex-row gap-12 items-start">
          {/* product visuals */}
          <div className="md:w-1/2">
            {gallery.length > 0 ? (
              <Carousel opts={{ align: "center", loop: true }} className="w-full">
                <CarouselContent>
                  {gallery.map((src, i) => (
                    <CarouselItem key={i} className="flex justify-center">
                      <div
                        className={`relative w-full max-h-[500px] md:max-h-[600px] md:aspect-[4/5] liquid-glass rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br ${product.accent_color ?? "from-slate-200/50 to-gray-100/50"
                          } p-6 shadow-xl border border-white/20`}
                      >
                        <img
                          src={src}
                          alt={`${product.name} ${i + 1}`}
                          className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-4 mt-4">
                  {/* reuse same glass buttons as showcase */}
                  <CarouselPrevious className="glass" />
                  <CarouselNext className="glass" />
                </div>
              </Carousel>
            ) : (
              <div
                className={`relative w-full liquid-glass overflow-hidden flex items-center justify-center bg-gradient-to-br ${product.accent_color ?? "from-slate-200/50 to-gray-100/50"
                  } aspect-square`}
              >
                <span className="text-6xl text-muted-foreground">?</span>
              </div>
            )}
          </div>

          {/* product info */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="text-sm font-medium text-primary uppercase tracking-widest mb-2">
                {product.category || "Medicube Essential"}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
            </div>

            <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  ${product.price}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  <BadgeCheck className="w-4 h-4" />
                  <span>In Stock</span>
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full text-lg h-14"
                onClick={handleAdd}
              >
                Add to Cart
              </Button>
            </div>

            {product.description && (
              <div className="prose prose-gray">
                <h3 className="text-lg font-semibold text-foreground mb-2">About this product</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/50">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="font-medium text-foreground text-sm">Authentic Guarantee</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Sourced from certified distributors.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="font-medium text-foreground text-sm">Fast Shipping</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Trackable delivery to your door.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
