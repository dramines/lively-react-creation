import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, StarHalf, ArrowRight } from "lucide-react";
import { categoriesContent } from "@/config/categoryContent";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VetementsCuisine = () => {
  const content = categoriesContent['vetements-cuisine'];
  const [sortBy, setSortBy] = useState("recommended");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsHeaderVisible(scrollPosition < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getBadgeStyle = (type: 'promo' | 'destockage' | 'new') => {
    switch (type) {
      case 'promo':
        return 'bg-red-600';
      case 'destockage':
        return 'bg-blue-600';
      case 'new':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(score);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{content.headerTitle}</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={content.bannerImage}
          alt={content.headerTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {content.headerTitle}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 animate-fade-in-delayed max-w-2xl mx-auto">
              {content.description}
            </p>
            <Button 
              asChild
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-full animate-fade-in-delayed"
              onClick={() => {
                const element = document.getElementById('products-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>
                Explorer nos produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Qualité Premium</h3>
              <p className="text-gray-600">Matériaux durables et confortables pour un usage professionnel intensif</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Expédition sous 24/48h pour toute la France métropolitaine</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Satisfaction Garantie</h3>
              <p className="text-gray-600">Service client disponible 6j/7 pour vous accompagner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Products Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Notre Collection</h2>
                <p className="text-gray-600 mt-2">
                  Découvrez notre sélection de {content.products.length} produits professionnels
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Trier par</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommandé</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="newest">Nouveautés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.products.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <div className={`absolute top-4 left-0 ${getBadgeStyle(product.badge.type)} text-white px-4 py-2 rounded-r-lg font-medium`}>
                        {product.badge.text}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {renderStars(product.rating.score)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({product.rating.reviews} avis)
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-gray-500">À partir de</span>
                        <span className="text-2xl font-bold text-primary">{product.price.toFixed(2)} €</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{product.originalPrice.toFixed(2)} €</span>
                        )}
                      </div>
                      <Button 
                        asChild
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        <Link to="/devis">
                          Demander un devis
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-primary to-primary/90 rounded-2xl text-white p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Besoin d'un devis personnalisé ?
            </h2>
            <p className="mb-8 text-lg max-w-2xl mx-auto opacity-90">
              Notre équipe est à votre disposition pour étudier vos besoins et vous proposer une solution sur mesure.
            </p>
            <Button 
              asChild
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-full"
            >
              <Link to="/devis">
                Contactez-nous maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VetementsCuisine;
