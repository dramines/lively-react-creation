
import { motion } from 'framer-motion';
import OptimizedImage from '../ui/OptimizedImage';
import { useTranslation } from 'react-i18next';

const ProductsHero = () => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  
  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/AboutImage.png"
            alt={t('products.hero_alt', 'Premium products')}
            className="w-full h-full object-cover"
            priority={true}
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Optional: Add text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Notre Sélection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-playfair text-[#700100] mb-4">
            {t('products_hero.our_selection')}
          </h2>
          <div className="w-24 h-1 bg-[#96cc39] mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('products_hero.description')}
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default ProductsHero;