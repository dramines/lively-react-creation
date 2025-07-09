
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateProduct, translateProducts } from '@/utils/translationUtils';

export const useProductTranslation = () => {
  const { i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  const translateSingleProduct = async (product: any) => {
    if (!product) return product;
    
    setIsTranslating(true);
    try {
      const currentLanguage = i18n.language;
      const translatedProduct = await translateProduct(product, currentLanguage);
      return translatedProduct;
    } catch (error) {
      console.error('Translation error:', error);
      return product;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateProductList = async (products: any[]) => {
    if (!products || products.length === 0) return products;
    
    setIsTranslating(true);
    try {
      const currentLanguage = i18n.language;
      const translatedProducts = await translateProducts(products, currentLanguage);
      return translatedProducts;
    } catch (error) {
      console.error('Translation error:', error);
      return products;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translateSingleProduct,
    translateProductList,
    isTranslating,
    currentLanguage: i18n.language
  };
};
