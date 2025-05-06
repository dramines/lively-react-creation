
import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { useTranslation } from 'react-i18next';
import ProductGridItem from './ProductGridItem';
import { useIsMobile } from '../../hooks/use-mobile';

interface ProductsGridProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  subcategory?: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onSelectProduct, subcategory }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  // Ensure we're showing all products even on mobile
  const filteredProducts = products;
  
  return (
    <div className="py-8">
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-500 text-lg">{t('products.no_products_found')}</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <ProductGridItem
              key={product.id}
              product={product}
              index={index}
              onSelect={onSelectProduct}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductsGrid;
