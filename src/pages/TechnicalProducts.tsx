
import React from 'react';
import { useTranslation } from 'react-i18next';

const TechnicalProducts: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-32 mb-20 container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {t('navbar.technical_products')}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          {t('navbar.technical_products_subtitle')}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm text-center">
          <p className="text-gray-500">
            Cette page est en cours de développement. Veuillez revenir bientôt pour découvrir
            notre gamme de produits techniques.
          </p>
          <p className="text-gray-500 mt-4">
            This page is under development. Please check back soon to discover 
            our range of technical products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalProducts;
