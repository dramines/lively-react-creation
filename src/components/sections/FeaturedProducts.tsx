
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart } from 'lucide-react';
import { getSizeFieldsForItemGroup, SIZE_DISPLAY_NAMES } from '@/data/productCategories';
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
  img2_product?: string;
  img3_product?: string;
  img4_product?: string;
  category_product: string;
  itemgroup_product: string;
  status_product: string;
  createdate_product: string;
  quantity_product?: string;
  // Size fields
  xs_size?: string;
  s_size?: string;
  m_size?: string;
  l_size?: string;
  xl_size?: string;
  xxl_size?: string;
  '3xl_size'?: string;
  '4xl_size'?: string;
  '48_size'?: string;
  '50_size'?: string;
  '52_size'?: string;
  '54_size'?: string;
  '56_size'?: string;
  '58_size'?: string;
}

const FeaturedProducts = () => {
  const { t } = useTranslation(['products', 'common', 'wishlist']);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [translatedProducts, setTranslatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastTranslatedLanguage, setLastTranslatedLanguage] = useState<string>('');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const { toast } = useToast();
  const { translateProductList, isTranslating, currentLanguage } = useProductTranslation();
  

  useEffect(() => {
    fetchExclusiveCollection();
  }, []);

  const fetchExclusiveCollection = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/get_exclusive_collection.php');
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
        setTranslatedProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching exclusive collection:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only translate when language changes and we have products
  useEffect(() => {
    if (products && products.length > 0 && currentLanguage !== lastTranslatedLanguage && !isTranslating) {
      translateProductList(products).then(translated => {
        setTranslatedProducts(translated);
        setLastTranslatedLanguage(currentLanguage);
      });
    }
  }, [currentLanguage, products, lastTranslatedLanguage, isTranslating, translateProductList]);

  const toggleLike = (product: Product) => {
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
        type: product.category_product,
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

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return formatCurrencyPrice(numPrice);
  };

  const getAvailableSizes = (product: Product): string[] => {
    const availableSizes: string[] = [];
    const allSizeFields = ['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'];
    
    allSizeFields.forEach(sizeField => {
      const sizeValue = product[sizeField as keyof Product] as string;
      if (sizeValue && parseInt(sizeValue) > 0) {
        const displayName = SIZE_DISPLAY_NAMES[sizeField];
        if (displayName) {
          availableSizes.push(displayName);
        }
      }
    });
    
    return availableSizes;
  };

  const getProductQuantity = (product: Product): number => {
    if (product.quantity_product) {
      const qty = parseInt(product.quantity_product);
      return qty;
    }
    
    const availableSizes = getAvailableSizes(product);
    if (availableSizes.length === 0) {
      return 1;
    }
    
    return 0;
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const formatQuantityText = (quantity: number): string => {
    if (quantity === 1) {
      return `${quantity} ${t('common:piece')}`;
    } else {
      return `${quantity} ${t('common:pieces')}`;
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-slate-200 animate-pulse mb-4"></div>
            <div className="h-4 bg-slate-200 animate-pulse w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/3.8] bg-slate-200 mb-4"></div>
                <div className="h-4 bg-slate-200 mb-2"></div>
                <div className="h-4 bg-slate-200 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 mb-6 tracking-wide">
            {t('products:exclusiveCollection')}
          </h2>
          <div className="w-12 md:w-16 h-px bg-slate-900 mx-auto mb-8"></div>
          <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
            {t('products:exclusiveCollectionDescription')}
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative mb-12">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {translatedProducts.map((product) => {
                const availableSizes = getAvailableSizes(product);
                const quantity = getProductQuantity(product);
                const hasAvailableInfo = availableSizes.length > 0 || quantity > 0;
                // Use img2_product instead of img2 for consistency with API response
                const hasSecondImage = product.img2_product && product.img2_product.trim() !== '';
                const isLiked = isInWishlist(product.id_product.toString());
                
                return (
                  <CarouselItem key={product.id_product} className="pl-2 md:pl-4 basis-2/3 md:basis-1/4">
                    <div className="group relative">
                      <div className="relative">
                        {/* Product Image with hover effect - Increased height for mobile */}
                        <div 
                          className="relative aspect-[3/4.5] md:aspect-[3/3.8] overflow-hidden bg-slate-100 mb-4 md:mb-6 rounded-lg cursor-pointer"
                          onClick={() => handleProductClick(product.id_product)}
                        >
                          {/* Primary Image - Always use server image */}
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
                          
                          {/* Secondary Image - only shown when hovering and img2_product exists */}
                          {hasSecondImage && (
                            <img
                              src={getProductImage(product.img2_product, product.id_product.toString())}
                              alt={`${product.nom_product} - Vue alternative`}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = getProductImage('', product.id_product.toString());
                              }}
                            />
                          )}

                          {/* Available Sizes/Quantity - Show on Hover with 25% height at bottom */}
                          {hasAvailableInfo && (
                            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center px-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                              {availableSizes.length > 0 ? (
                                <>
                                  <div className="text-xs text-slate-600 mb-1 font-medium text-center">
                                    {t('products:availableSizes')}
                                  </div>
                                  <div className="flex flex-wrap gap-1 justify-center">
                                    {availableSizes.map((size) => (
                                      <span 
                                        key={size}
                                        className="bg-slate-100 text-slate-700 px-2 py-1 text-xs rounded font-medium"
                                      >
                                        {size}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-xs text-slate-600 mb-1 font-medium text-center">
                                    {t('common:available')}
                                  </div>
                                  <div className="text-xs text-slate-700 font-medium text-center">
                                    {formatQuantityText(quantity)}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="text-left px-1 relative">
                          {/* Category and Heart on same line */}
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-slate-500 tracking-widest uppercase font-medium">
                              {product.category_product} {product.itemgroup_product && `• ${product.itemgroup_product}`}
                            </span>
                            
                            {/* Heart Button - Same line as category */}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="w-6 h-6 md:w-8 md:h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(product);
                              }}
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
                          
                          <h3 
                            className="font-serif font-light text-slate-900 mb-3 md:mb-4 text-base md:text-lg leading-snug cursor-pointer hover:text-slate-600 transition-colors"
                            onClick={() => handleProductClick(product.id_product)}
                          >
                            {product.nom_product}
                          </h3>
                          
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-base md:text-lg font-medium text-slate-900">
                              {formatPrice(product.price_product)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Navigation Arrows - Centered to images and closer to edges */}
            <CarouselPrevious className="absolute left-2 top-[45%] -translate-y-1/2 w-12 h-12 border border-gray-300 bg-white/80 hover:bg-white" />
            <CarouselNext className="absolute right-2 top-[45%] -translate-y-1/2 w-12 h-12 border border-gray-300 bg-white/80 hover:bg-white" />
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-medium tracking-wide"
            onClick={() => navigate('/category/all')}
          >
            {t('products:viewAllProducts')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
