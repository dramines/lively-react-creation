
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
  const { t, i18n } = useTranslation();
  const { key, descriptionKey, fallback } = getProductTranslationPath(product.title);
  const ingredientKeys = getProductIngredientKeys(product);

  // Check for special product types that need extra handling
  const normalizedTitle = product.title.toLowerCase().trim();
  const isPlateauDeDattes = normalizedTitle.includes('plateau') && normalizedTitle.includes('dattes');
  const isPaquetDe3 = normalizedTitle.includes('paquet de 3') || normalizedTitle.includes('paquet 3');

  // Enhanced logging for debugging
  console.log('Translation debug:', { 
    productId: product.id,
    productTitle: product.title,
    normalizedTitle,
    titleKey: key, 
    descKey: descriptionKey, 
    fallback,
    language: i18n.language,
    keyExists: key ? i18n.exists(key) : false,
    titleTranslation: key ? t(key) : '(no translation key)',
    namespaceLookup: i18n.exists('product_names') ? 'exists' : 'missing',
    productType: product.category,
    isPlateauDeDattes,
    isPaquetDe3,
    specialKey: isPlateauDeDattes ? 'product_names.dates_platter' : isPaquetDe3 ? 'product_names.three_dates_package' : null,
    specialKeyExists: isPlateauDeDattes ? i18n.exists('product_names.dates_platter') : isPaquetDe3 ? i18n.exists('product_names.three_dates_package') : false,
    specialKeyTranslation: isPlateauDeDattes ? t('product_names.dates_platter') : isPaquetDe3 ? t('product_names.three_dates_package') : null,
    descriptionKeyExists: isPlateauDeDattes ? i18n.exists('product_descriptions.dates_platter') : isPaquetDe3 ? i18n.exists('product_descriptions.three_dates_package') : i18n.exists(descriptionKey || '')
  });

  // Get the translated text with proper checking and fallbacks
  let translatedTitle = fallback;
  let translatedDescription = product.description || ''; // Default to original description
  
  // Special case handling for Plateau de Dattes
  if (isPlateauDeDattes) {
    // Always use the direct translation key for Plateau de Dattes
    translatedTitle = t('product_names.dates_platter');
    if (i18n.exists('product_descriptions.dates_platter')) {
      translatedDescription = t('product_descriptions.dates_platter');
      console.log(`Special case handling: Plateau de Dattes description - Using direct translation`);
    }
  } 
  // Special case handling for Paquet de 3
  else if (isPaquetDe3) {
    // Always use the direct translation key for Paquet de 3
    translatedTitle = t('product_names.three_dates_package');
    if (i18n.exists('product_descriptions.three_dates_package')) {
      translatedDescription = t('product_descriptions.three_dates_package'); 
      console.log(`Special case handling: Paquet de 3 description - Using direct translation`);
    }
  }
  // Regular case handling
  else if (key && i18n.exists(key)) {
    translatedTitle = t(key);
    console.log(`Regular case: Translation found for key ${key}: ${translatedTitle}`);
    
    if (descriptionKey && i18n.exists(descriptionKey)) {
      translatedDescription = t(descriptionKey);
      console.log(`Regular description found for key ${descriptionKey}: ${translatedDescription.substring(0, 30)}...`);
    }
  } 
  else {
    console.log(`No translation found for key ${key}, using fallback: ${fallback}`);
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-medium">
        {translatedTitle}
      </h3>
      
      {showDescription && translatedDescription && (
        <p className="mt-2 text-gray-600">{translatedDescription}</p>
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