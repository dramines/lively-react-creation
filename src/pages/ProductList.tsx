
import { motion } from 'framer-motion';
import { Leaf, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import type { ClientType } from '../types';
import { getProductTranslationPath } from '../utils/productTranslations';

interface ProductListProps {
  clientType: ClientType;
  category: string;
  onProductSelect: (productId: string) => void;
}

const ProductList = ({ clientType, category, onProductSelect }: ProductListProps) => {
  const { t } = useTranslation();

  // This would normally come from an API or database
  const products = [
    {
      id: '1',
      title: 'Dattes Deglet Nour Premium',
      description: 'Nos dattes Deglet Nour sont soigneusement sélectionnées et récoltées à la main.',
      image: 'produitstemplate.png',
      category: 'dattes-fraiches',
      certifications: ['bio', 'equitable'],
      price: clientType === 'B2B' ? 'Prix professionnel' : '12.99€',
      isOrganic: true,
      isFairTrade: true
    },
    // Add more products as needed
  ];

  const filteredProducts = category === 'tous' 
    ? products 
    : products.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6F0]/50 to-white/50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const translationInfo = getProductTranslationPath(product.title);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {product.isOrganic && (
                      <span className="bg-[#96cc39] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Leaf className="w-4 h-4" />
                        {t('products.organic')}
                      </span>
                    )}
                   
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#700100] mb-2">
                    {translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-semibold text-[#96cc39] mb-4">
                    {product.price}
                  </p>
                  <Button
                    onClick={() => onProductSelect(product.id)}
                    className="w-full bg-[#700100] hover:bg-[#96cc39] text-white transition-colors"
                  >
                    {t('products.view_details')}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
