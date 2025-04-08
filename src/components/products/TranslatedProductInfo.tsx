
import { useTranslation } from 'react-i18next';
import { getProductTranslationPath, getProductIngredientKeys } from '../../utils/productTranslations';

interface TranslatedProductInfoProps {
  product: any;
  showDescription?: boolean;
  showIngredients?: boolean;
  className?: string;
}

const TranslatedProductInfo = ({ 
  product, 
  showDescription = true, 
  showIngredients = true,
  className = ''
}: TranslatedProductInfoProps) => {
  const { t } = useTranslation();
  const { key, descriptionKey, fallback } = getProductTranslationPath(product.title);
  const ingredientKeys = getProductIngredientKeys(product);

  return (
    <div className={className}>
      <h3 className="text-lg font-medium">{key ? t(key) : fallback}</h3>
      
      {showDescription && descriptionKey && (
        <p className="mt-2 text-gray-600">{t(descriptionKey)}</p>
      )}
      
      {showIngredients && ingredientKeys.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">{t('product_details.ingredients_title')}</h4>
          <ul className="mt-2 list-disc pl-5 text-gray-600">
            {ingredientKeys.map((ingredientKey, index) => (
              <li key={index}>{t(`product_ingredients.${ingredientKey}`)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TranslatedProductInfo;
