import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import Philosophy from "@/components/Philosophy";
import Lookbook from "@/components/Lookbook";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ProductShowcase />
      <Philosophy />
      <Lookbook />
      <Footer />
    </div>
  );
};

export default Index;
