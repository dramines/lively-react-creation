
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { getProductImage } from '@/utils/imageUtils';

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
          `https://draminesaid.com/lucci/api/get_related_products.php?id_product=${currentProductId}&limit=8`
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

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numPrice} TND`;
  };

  const calculateDiscountedPrice = (price: string | number, discount: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;
    return numPrice - (numPrice * numDiscount / 100);
  };

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif text-center text-slate-900 mb-8">
          {t('youMayAlsoLike')}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <div className="relative">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                  stopOnMouseEnter: true,
                })
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.map((product) => (
                  <CarouselItem key={product.id_product} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <Link to={`/product/${product.id_product}`} className="block group">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={getProductImage(product.img_product, product.id_product)}
                            alt={product.nom_product}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = getProductImage('', product.id_product);
                            }}
                          />
                        </div>
                        
                        <div className="p-4">
                          <div className="mb-2">
                            <span className="text-xs text-slate-500 uppercase tracking-wide">
                              {product.type_product} • {product.itemgroup_product}
                            </span>
                          </div>
                          
                          <h3 className="font-medium text-slate-900 mb-2 group-hover:text-slate-700 transition-colors line-clamp-2">
                            {product.nom_product}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            {product.discount_product && parseFloat(product.discount_product) > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">
                                  {formatPrice(calculateDiscountedPrice(product.price_product, product.discount_product))}
                                </span>
                                <span className="text-sm text-red-500 line-through">
                                  {formatPrice(product.price_product)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-semibold text-slate-900">
                                {formatPrice(product.price_product)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
