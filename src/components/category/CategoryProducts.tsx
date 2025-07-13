
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductImage } from '@/utils/imageUtils';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import { useProductTranslation } from '@/hooks/useProductTranslation';

interface Product {
  id_product: number;
  nom_product: string;
  price_product: string;
  discount_product?: string;
  img_product: string;
  img2?: string;
  category_product: string;
  itemgroup_product: string;
  type_product: string;
}

interface CategoryProductsProps {
  products: Product[];
  loading: boolean;
  likedProducts: Set<number>;
  onToggleLike: (productId: number) => void;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ 
  products, 
  loading,
  likedProducts,
  onToggleLike 
}) => {
  const { t } = useTranslation(['products', 'wishlist']);
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const { toast } = useToast();
  const { translateProductList, isTranslating, currentLanguage } = useProductTranslation();
  
  const [translatedProducts, setTranslatedProducts] = useState<Product[]>([]);
  const [lastTranslatedLanguage, setLastTranslatedLanguage] = useState<string>('');
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  // Set initial products without translation
  useEffect(() => {
    if (products && products.length > 0 && translatedProducts.length === 0) {
      setTranslatedProducts(products);
    }
  }, [products]);

  // Only translate when language changes and we have products
  useEffect(() => {
    if (products && products.length > 0 && currentLanguage !== lastTranslatedLanguage && !isTranslating) {
      translateProductList(products).then(translated => {
        setTranslatedProducts(translated);
        setLastTranslatedLanguage(currentLanguage);
      });
    }
  }, [currentLanguage, products, lastTranslatedLanguage, isTranslating, translateProductList]);

  // Staggered animation effect for product cards
  useEffect(() => {
    if (translatedProducts.length > 0 && !loading) {
      // Reset visible items when products change
      setVisibleItems(new Set());
      
      // Animate cards one by one with staggered delay
      translatedProducts.forEach((product, index) => {
        setTimeout(() => {
          setVisibleItems(prev => new Set([...prev, product.id_product]));
        }, index * 100); // 100ms delay between each card
      });
    }
  }, [translatedProducts, loading]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return formatCurrencyPrice(numPrice);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = product.id_product.toString();
    const isLiked = isInWishlist(productId);

    if (isLiked) {
      removeFromWishlist(productId);
      toast({
        title: t('wishlist:notifications.removed'),
        description: t('wishlist:notifications.removedDescription'),
      });
    } else {
      const wishlistItem = {
        id: productId,
        name: product.nom_product,
        price: `${product.price_product} TND`,
        image: getProductImage(product.img_product, productId),
        category: product.category_product,
        type: product.type_product,
        itemgroup: product.itemgroup_product,
        discount: undefined, // Always set discount to undefined
      };
      
      addToWishlist(wishlistItem);
      toast({
        title: t('wishlist:notifications.added'),
        description: t('wishlist:notifications.addedDescription'),
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={index} 
            className="animate-pulse opacity-0 animate-fade-in"
            style={{ 
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="aspect-[3/4] bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Handle empty state
  if (!loading && translatedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-slate-400" />
        </div>
        
        <h3 className="text-2xl font-serif text-slate-900 mb-4">
          {t('products:emptyState.title')}
        </h3>
        
        <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
          {t('products:emptyState.description')}
        </p>
        
        <p className="text-slate-500 text-sm mb-8 max-w-lg leading-relaxed">
          {t('products:emptyState.suggestion')}
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2"
        >
          {t('products:emptyState.exploreOtherCategories')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {translatedProducts.map((product) => {
        const hasSecondImage = product.img2 && product.img2.trim() !== '';
        const isLiked = isInWishlist(product.id_product.toString());
        const isVisible = visibleItems.has(product.id_product);

        return (
          <div 
            key={product.id_product} 
            className={`group relative transition-all duration-500 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative">
              {/* Product Image */}
              <div 
                className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-lg cursor-pointer mb-4"
                onClick={() => handleProductClick(product.id_product)}
              >
                {/* Primary Image */}
                <img
                  src={getProductImage(product.img_product, product.id_product.toString())}
                  alt={product.nom_product}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    hasSecondImage ? 'group-hover:opacity-0' : ''
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = getProductImage('', product.id_product.toString());
                  }}
                />
                
                {/* Secondary Image */}
                {hasSecondImage && (
                  <img
                    src={getProductImage(product.img2, product.id_product.toString())}
                    alt={`${product.nom_product} - Vue alternative`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = getProductImage('', product.id_product.toString());
                    }}
                  />
                )}

                {/* Heart Button */}
                <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => toggleWishlist(product, e)}
                    className="w-8 h-8 md:w-10 md:h-10 p-0 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full"
                  >
                    <Heart
                      className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${
                        isLiked
                          ? 'text-red-500 fill-red-500'
                          : 'text-slate-600 hover:text-red-500'
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-left">
                <div className="mb-2">
                  <span className="text-xs text-slate-500 tracking-widest uppercase font-medium">
                    {product.category_product} {product.itemgroup_product && `• ${product.itemgroup_product}`}
                  </span>
                </div>

                <h3 
                  className="font-serif font-light text-slate-900 mb-3 text-base md:text-lg leading-snug cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleProductClick(product.id_product)}
                >
                  {product.nom_product}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg font-medium text-slate-900">
                    {formatPrice(product.price_product)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryProducts;
