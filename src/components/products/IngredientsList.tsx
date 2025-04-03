
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getProductIngredientKeys } from '../../utils/productTranslations';

interface IngredientsListProps {
  product: any;
}

const IngredientsList: React.FC<IngredientsListProps> = ({ product }) => {
  const { t } = useTranslation();
  const ingredientKeys = getProductIngredientKeys(product);

  if (!ingredientKeys.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-[#64381b]">{t('product_page.ingredients')}</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {ingredientKeys.map((key) => (
          <li key={key} className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-[#96cc39] mt-1.5 mr-2 flex-shrink-0"></span>
            <span className="text-gray-700">{t(`product_ingredients.${key}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsList;
