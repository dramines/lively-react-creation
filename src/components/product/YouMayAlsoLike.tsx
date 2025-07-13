
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

import { getProductImage } from '@/utils/imageUtils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Product {
  id_product: string;
  nom_product: string;
  img_product: string;
  price_product: string;
  discount_product?: string;
  type_product: string;
  itemgroup_product: string;
}

interface YouMayAlsoLikeProps {
  currentProductId: string;
}

const YouMayAlsoLike = ({ currentProductId }: YouMayAlsoLikeProps) => {
  const { t } = useTranslation(['products']);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://draminesaid.com/lucci/api/get_related_products.php?id_product=${currentProductId}&limit=10`
        );
        const result = await response.json();
        if (result.success) {
          // Filter out the current product
          const filteredProducts = result.data.filter((product: Product) => product.id_product !== currentProductId);
          setProducts(filteredProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentProductId]);

  const { formatPrice: formatCurrencyPrice } = useCurrency();
  
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return formatCurrencyPrice(numPrice);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-serif text-center text-slate-900 mb-12">
            {t('youMayAlsoLike')}
          </h2>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-serif text-center text-slate-900 mb-12">
          {t('youMayAlsoLike')}
        </h2>
        
        <div className="relative">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id_product} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Link to={`/product/${product.id_product}`} className="block group">
                    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                        <img
                          src={getProductImage(product.img_product, product.id_product)}
                          alt={product.nom_product}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = getProductImage('', product.id_product);
                          }}
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs text-slate-500 uppercase tracking-wide">
                            {product.type_product} • {product.itemgroup_product}
                          </span>
                        </div>
                        
                        <h3 className="font-serif font-light text-slate-900 mb-4 text-lg leading-snug group-hover:text-slate-700 transition-colors line-clamp-2">
                          {product.nom_product}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 text-lg">
                            {formatPrice(product.price_product)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation arrows - Enhanced for mobile */}
            <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border-slate-300 shadow-lg h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-xl z-10" />
            <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border-slate-300 shadow-lg h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-xl z-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
