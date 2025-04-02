
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import OptimizedImage from '../ui/OptimizedImage';
import { getProductTranslationPath } from '../../utils/productTranslations';
import ProductBadge from './ProductBadge';

interface ProductCardProps {
  product: Product;
  onSelect: (id: string) => void;
}

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const { t } = useTranslation();
  
  // Function to handle click on the entire card
  const handleCardClick = () => {
    onSelect(product.id);
  };

  // Get translation info for this product
  const translationInfo = getProductTranslationPath(product.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Number(product.id) * 0.1 }}
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="overflow-hidden rounded-2xl">
        <div className="relative">
          <OptimizedImage
            src={product.image}
            alt={translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
            className="w-full aspect-[4/4] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Use the ProductBadge component for consistent badge display */}
          <ProductBadge product={product} productId={Number(product.id)} />
        </div>
        
        <div className="pt-6 pb-4 px-2">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-playfair text-[#700100]">
              {translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
            </h3>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                onSelect(product.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#700100] flex items-center gap-2 hover:text-[#96cc39] transition-colors duration-300"
            >
              <span className="text-sm font-medium">{t('products.view_details')}</span>
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
