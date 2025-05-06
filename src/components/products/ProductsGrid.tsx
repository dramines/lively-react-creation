
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
  
  // This should display the products that were already filtered in Products.tsx
  const filteredProducts = products;
  
  console.log(`ProductsGrid rendering ${filteredProducts.length} products with subcategory: ${subcategory || 'none'}`);
  
  // Print out details of the first few products to help debug
  if (filteredProducts.length > 0) {
    filteredProducts.slice(0, 3).forEach((product, i) => {
      console.log(`Product ${i+1}:`, { 
        id: product.id, 
        title: product.title,
        category: product.category, 
        subcategory: product.subcategory 
      });
    });
  }
  
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
