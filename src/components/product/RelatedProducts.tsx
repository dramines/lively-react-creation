
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { getProductImage } from '@/utils/imageUtils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Product {
  id_product: number;
  nom_product: string;
  price_product: string;
  discount_product?: string;
  img_product: string;
  img2_product?: string;
  category_product: string;
  itemgroup_product: string;
  status_product: string;
  createdate_product: string;
}

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
  itemGroup?: string;
}

const RelatedProducts = ({ currentProductId, category, itemGroup }: RelatedProductsProps) => {
  const { t } = useTranslation(['products']);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, category, itemGroup]);

  const fetchRelatedProducts = async () => {
    setLoading(true);
    try {
      // Build API URL to get products from same category/itemgroup
      const apiUrl = new URL('https://draminesaid.com/lucci/api/get_products_by_category.php');
      if (category) apiUrl.searchParams.set('category', category);
      if (itemGroup) apiUrl.searchParams.set('subcategory', itemGroup);
      apiUrl.searchParams.set('limit', '4');
      
      const response = await fetch(apiUrl.toString());
      const result = await response.json();
      
      if (result.success) {
        // Filter out current product
        const filteredProducts = result.data.filter(
          (product: Product) => product.id_product.toString() !== currentProductId
        );
        setProducts(filteredProducts.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const { formatPrice: formatCurrencyPrice } = useCurrency();
  
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return formatCurrencyPrice(numPrice);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  if (loading) {
    return (
      <div className="mt-16 pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-serif font-light text-slate-900 mb-8 text-center">
          Produits Similaires
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] bg-slate-200 mb-4 rounded-lg"></div>
              <div className="h-4 bg-slate-200 mb-2"></div>
              <div className="h-4 bg-slate-200 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-serif font-light text-slate-900 mb-8 text-center">
        Produits Similaires
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => {
          const hasSecondImage = product.img2_product && product.img2_product.trim() !== '' && product.img2_product !== 'null';
          
          return (
            <div key={product.id_product} className="group relative">
              <div className="relative">
                {/* Product Image with hover effect */}
                <div 
                  className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-4 md:mb-6 rounded-lg cursor-pointer"
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
                  
                  {/* Secondary Image - only shown when hovering and img2 exists */}
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
                </div>

                {/* Product Info */}
                <div className="text-left px-1 relative">
                  {/* Category and Heart on same line */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 tracking-widest uppercase font-medium">
                      {product.category_product} {product.itemgroup_product && `• ${product.itemgroup_product}`}
                    </span>
                    
                    {/* Heart Button */}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-6 h-6 md:w-8 md:h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(product.id_product);
                      }}
                    >
                      <Heart 
                        className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${
                          likedProducts.has(product.id_product) 
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
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
