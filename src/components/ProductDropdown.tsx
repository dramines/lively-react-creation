
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductDropdownProps {
  isOpen: boolean;
  activeCategory: string | null;
  onClose: () => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({ isOpen, activeCategory, onClose }) => {
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const getCategoryImage = (categoryKey: string | null) => {
    const categoryImages = {
      surMesure: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=800&fit=crop&crop=center',
      pretAPorter: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop&crop=center', 
      accessoires: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop&crop=center'
    };
    return categoryImages[categoryKey as keyof typeof categoryImages] || categoryImages.surMesure;
  };

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      onClose();
    }, 1000); // Increased timeout to 1000ms for better UX
    setCloseTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const categories = {
    surMesure: {
      title: 'Sur Mesure',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=800&fit=crop&crop=center',
      url: '/category/surMesure',
      sections: [
        {
          title: 'Homme',
          items: [
            { name: 'Blazers', url: '/category/surMesure/homme-blazers', itemgroup: 'blazers' },
            { name: 'Blousons', url: '/category/surMesure/homme-blouson', itemgroup: 'blouson' },
            { name: 'Manteaux', url: '/category/surMesure/homme-manteau', itemgroup: 'manteau' },
            { name: 'Djine', url: '/category/surMesure/homme-djine', itemgroup: 'djine' },
            { name: 'Slack', url: '/category/surMesure/homme-slack', itemgroup: 'slack' },
            { name: 'Pantalons', url: '/category/surMesure/homme-pantalon', itemgroup: 'pantalon' }
          ]
        },
        {
          title: 'Femme',
          items: [
            { name: 'Chemises', url: '/category/surMesure/femme-chemise', itemgroup: 'chemise' },
            { name: 'Costumes', url: '/category/surMesure/femme-costume', itemgroup: 'costume' },
            { name: 'Blazers', url: '/category/surMesure/femme-blazer', itemgroup: 'blazer' }
          ]
        }
      ]
    },
    pretAPorter: {
      title: 'Prêt à Porter',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop&crop=center',
      url: '/category/pretAPorter',
      sections: [
        {
          title: 'Collections',
          items: [
            { name: 'Chemises', url: '/category/pretAPorter/chemise', itemgroup: 'chemise' },
            { name: 'T-shirts', url: '/category/pretAPorter/tshirt', itemgroup: 'tshirt' },
            { name: 'Polos', url: '/category/pretAPorter/polo', itemgroup: 'polo' },
            { name: 'Chaussures', url: '/category/pretAPorter/chaussure', itemgroup: 'chaussure' },
            { name: 'Ceintures', url: '/category/pretAPorter/ceinture', itemgroup: 'ceinture' },
            { name: 'Maroquinerie', url: '/category/pretAPorter/maroquinerie', itemgroup: 'maroquinerie' }
          ]
        }
      ]
    },
    accessoires: {
      title: 'Accessoires',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop&crop=center',
      url: '/category/accessoires',
      sections: [
        {
          title: 'Collections',
          items: [
            { name: 'Cravates', url: '/category/accessoires/cravate', itemgroup: 'cravate' },
            { name: 'Pochettes', url: '/category/accessoires/pochette', itemgroup: 'pochette' },
            { name: 'Maroquinerie', url: '/category/accessoires/maroquinerie', itemgroup: 'maroquinerie' },
            { name: 'Autres Accessoires', url: '/category/accessoires/autre', itemgroup: 'autre' }
          ]
        }
      ]
    }
  };

  if (!isOpen || !activeCategory || !categories[activeCategory as keyof typeof categories]) {
    return null;
  }

  const category = categories[activeCategory as keyof typeof categories];

  return (
    <div 
      className="fixed top-[104px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 animate-fade-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Side - Items */}
            <div className="col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900 font-hm-sans border-b border-gray-100 pb-1">
                      {section.title}
                    </h3>
                    <div className="space-y-0.5">
                      {section.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          className="group flex items-center gap-2 w-full p-1.5 hover:bg-gray-50 rounded-md transition-all duration-200"
                          onClick={() => {
                            navigate(item.url);
                            onClose();
                          }}
                        >
                          <span className="font-medium text-gray-900 text-base group-hover:text-black transition-colors font-hm-sans">
                            {item.name}
                          </span>
                          <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 ml-auto transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Side - Category Image */}
            <div className="col-span-4">
              <div className="bg-gray-50 rounded-lg p-3 h-full flex flex-col items-center justify-center">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 shadow-sm">
                  <img 
                    src={getCategoryImage(activeCategory)} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 font-hm-sans text-center mb-1">
                  {category.title}
                </h2>
                <p className="text-gray-600 text-sm text-center font-hm-sans">
                  Collection premium
                </p>
              </div>
            </div>
          </div>
          
          {/* Centered bottom button */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <button 
              onClick={() => {
                navigate(category.url);
                onClose();
              }}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium font-hm-sans text-sm"
            >
              Voir Toute la Collection {category.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDropdown;
