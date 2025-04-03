
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductGridItemProps {
  product: Product;
  index: number;
  onSelect: (id: string) => void;
}

const ProductGridItem: React.FC<ProductGridItemProps> = ({ product, index, onSelect }) => {
  return (
    <motion.div 
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: index * 0.1 } 
      }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <div className="relative">
        <ProductCard product={product} onSelect={onSelect} />
      </div>
    </motion.div>
  );
};

export default ProductGridItem;
