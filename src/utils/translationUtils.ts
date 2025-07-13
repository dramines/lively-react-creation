interface TranslationResponse {
  translatedText: string;
  originalText: string;
}

// Cache to store translations and avoid repeated API calls
const translationCache = new Map<string, string>();

export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string> => {
  // Return original text if no translation needed
  if (!text || text.trim() === '') return text;
  if (targetLanguage === sourceLanguage) return text;

  // Create cache key
  const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Extract translated text from Google Translate response
    let translatedText = '';
    if (data && data[0] && Array.isArray(data[0])) {
      translatedText = data[0].map((item: any) => item[0]).join('');
    }
    
    // Fallback to original text if translation fails
    const result = translatedText || text;
    
    // Cache the result
    translationCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.warn('Translation failed:', error);
    return text; // Return original text on error
  }
};

export const translateProduct = async (
  product: any,
  targetLanguage: string
): Promise<any> => {
  if (!product) return product;

  try {
    // Detect source language based on content (French is likely default)
    const sourceLanguage = 'fr';
    
    // Only translate if target language is different
    if (targetLanguage === sourceLanguage) return product;

    const [translatedName, translatedDescription] = await Promise.all([
      translateText(product.nom_product, targetLanguage, sourceLanguage),
      translateText(product.description_product, targetLanguage, sourceLanguage)
    ]);

    return {
      ...product,
      nom_product: translatedName,
      description_product: translatedDescription,
      // Keep original values as backup
      original_nom_product: product.nom_product,
      original_description_product: product.description_product
    };
  } catch (error) {
    console.warn('Product translation failed:', error);
    return product; // Return original product on error
  }
};

export const translateProducts = async (
  products: any[],
  targetLanguage: string
): Promise<any[]> => {
  if (!products || products.length === 0) return products;

  try {
    // Translate products in parallel but with a small delay to avoid rate limiting
    const translatedProducts = await Promise.all(
      products.map((product, index) => 
        new Promise(resolve => 
          setTimeout(() => 
            translateProduct(product, targetLanguage).then(resolve),
            index * 100 // 100ms delay between requests
          )
        )
      )
    );

    return translatedProducts as any[];
  } catch (error) {
    console.warn('Bulk product translation failed:', error);
    return products; // Return original products on error
  }
};

// Clear cache when needed (optional)
export const clearTranslationCache = () => {
  translationCache.clear();
};
