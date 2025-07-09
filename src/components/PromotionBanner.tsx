
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromotionBanner = () => {
  const navigate = useNavigate();

  const handlePromoClick = (promoId: number) => {
    switch (promoId) {
      case 1:
        // Collection Automne - navigate to all products
        navigate('/');
        break;
      case 2:
        // Soldes - navigate to products with discounts
        navigate('/category/all?discount=true');
        break;
      case 3:
        // Livraison Gratuite - navigate to products over 200 TND
        navigate('/category/all?minPrice=200');
        break;
      default:
        navigate('/');
    }
  };

  const promotions = [
    {
      id: 1,
      title: "Collection Automne",
      subtitle: "Nouveautés Disponibles",
      description: "Découvrez notre nouvelle collection automne-hiver",
      buttonText: "Découvrir",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Soldes",
      subtitle: "Jusqu'à -50%",
      description: "Sélection d'articles à prix réduits",
      buttonText: "Voir les soldes",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Livraison Gratuite",
      subtitle: "Dès 200 TND d'achat",
      description: "Sur toute la collection",
      buttonText: "Commander",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop",
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative overflow-hidden bg-white group cursor-pointer"
              onClick={() => handlePromoClick(promo.id)}
            >
              {/* Background image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content - Style minimaliste */}
              <div className="p-8 text-center">
                <h3 className="text-xl font-light mb-2 tracking-wide uppercase">{promo.title}</h3>
                <p className="text-sm text-gray-600 font-light mb-1">{promo.subtitle}</p>
                <p className="text-xs text-gray-500 mb-6">{promo.description}</p>

                <button 
                  className="inline-flex items-center gap-2 text-black text-xs font-medium tracking-widest uppercase hover:gap-3 transition-all duration-300 border-b border-black pb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePromoClick(promo.id);
                  }}
                >
                  {promo.buttonText}
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
