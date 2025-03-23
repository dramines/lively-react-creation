
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '../../types';
import { Badge } from 'lucide-react';

interface ProductGridItemProps {
  product: Product;
  index: number;
  onSelect: (id: string) => void;
}

// Simple FiguesIcon component to replace the imported one
const FiguesIcon = ({ size = 24, color = 'currentColor' }) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <Badge size={size} color={color} />
      <span className="absolute text-[10px] font-bold" style={{ color }}>
        FD
      </span>
    </div>
  );
};

const ProductGridItem: React.FC<ProductGridItemProps> = ({ product, index, onSelect }) => {
  // Check if it's any of the figues djebaa categories
  const isFiguesDjebaa = product.title === 'Figues djebaa 200g' || 
                         product.category === 'figues-sechees-djebaa' as any;
  
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
        {isFiguesDjebaa && (
          <div className="absolute top-2 right-2">
            <FiguesIcon size={32} color="#700100" />
          </div>
        )}
        {/* Remove ProductBadge from here since it's already in ProductCard */}
      </div>
    </motion.div>
  );
};

export default ProductGridItem;
