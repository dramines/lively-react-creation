import { Award, Clock, DollarSign, MessageSquare, Truck, Shield, Rocket, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCarousel from "./ProductCarousel";
import { ProductCategory } from "./types";
import { products } from "@/config/products";
import { useEffect, useState, useRef } from "react";

interface PersonalizationHeroProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory: string | null;
}

const PersonalizationHero = ({ onCategorySelect, selectedCategory }: PersonalizationHeroProps) => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Show step 1 immediately when in view
          setVisibleSteps([1]);

          // Show step 2 after 1 second
          const timer2 = setTimeout(() => {
            setVisibleSteps(prev => [...prev, 2]);
          }, 1000);

          // Show step 3 after 2 seconds
          const timer3 = setTimeout(() => {
            setVisibleSteps(prev => [...prev, 3]);
          }, 2000);

          return () => {
            clearTimeout(timer2);
            clearTimeout(timer3);
          };
        }
      },
      {
        threshold: 0.1 // Trigger when at least 10% of the element is visible
      }
    );

    if (stepsRef.current) {
      observer.observe(stepsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollToProducts = () => {
    const productsSection = document.querySelector('#products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Convert products config to ProductCategory type
  const productCategories: ProductCategory[] = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    startingPrice: product.startingPrice
  }));

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <img
          src="/PersoPageBanner.png"
          alt="Personnalisation de vêtement de travail"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 animate-fade-in">
            Créez Votre<br />
            <span className="text-secondary">Design Unique</span>
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-3xl mx-auto animate-fade-in-delayed opacity-90">
            DONNEZ DE LA VISIBILITÉ À VOTRE ENTREPRISE !
          </p>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-primary px-8 py-6 text-lg animate-fade-in-delayed transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={handleScrollToProducts}
          >
            Commencer votre design
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in">
            <Clock className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Devis gratuit sous 48h</h3>
            <p className="text-sm text-gray-600">Réponse rapide garantie pour votre projet</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-delayed">
            <Shield className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Qualité garantie</h3>
            <p className="text-sm text-gray-600">Des produits de haute qualité et durables</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-delayed">
            <MessageSquare className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Conseils sur-mesure</h3>
            <p className="text-sm text-gray-600">Une équipe d'experts à votre écoute</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-delayed">
            <Gift className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Design personnalisé</h3>
            <p className="text-sm text-gray-600">Des créations uniques pour votre marque</p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div id="products-section" className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Votre design en <span className="text-secondary">3 étapes simples</span>
        </h2>
      </div>
      <div className="container mx-auto -mt-12 py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
          <ProductCarousel
            categories={productCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalizationHero;
