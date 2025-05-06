
/**
 * Utility functions for product title translations
 */

/**
 * Maps French product titles to translation keys
 */
export const getProductTranslationKey = (title: string): string => {
  const titleToKeyMap: Record<string, string> = {
    'Paquet de Dattes 1kg': 'dates_package_1kg',
    'Paquet de Dattes 500g': 'dates_package_500g',
    'Coffret de Dattes 1kg': 'dates_gift_box_1kg',
    'Coffret de Dattes 500g': 'dates_gift_box_500g',
    'Barquette de Dattes Dénoyautées 500g': 'pitted_dates_tray_500g',
    'Barquette de Dattes Dénoyautées 200g': 'pitted_dates_tray_200g',
    'Dattes Standard Dénoyautées 5kg/10kg': 'standard_pitted_dates',
    'Figues ZIDI 200g': 'dried_figs_200g',
    'Figues Séchées en Vrac': 'bulk_dried_figs',
    'Figues Toujane 200g': 'toujane_figs_200g',
    'Figues djebaa 200g': 'djebaa_figs_200g',
    'Café de Noyaux de Dattes 200g': 'date_kernel_coffee_200g',
    'Poudre (Sucre) de Dattes 300g': 'date_powder_sugar_300g',
    'Sirop de Dattes 340ml': 'date_syrup_340ml',
    'Paquet de 3 dattes': 'three_dates_package',
    'Plateau de dattes': 'dates_platter',
    'Plateau de Dattes': 'dates_platter',
    'Plateau de Dattes 3kg': 'dates_platter',
    'Plateau de Dattes 6kg': 'dates_platter',
    // Add variants with different spacing/formatting
    'Paquet Dattes 1kg': 'dates_package_1kg',
    'Paquet Dattes 500g': 'dates_package_500g',
    'Coffret Dattes 1kg': 'dates_gift_box_1kg',
    'Coffret Dattes 500g': 'dates_gift_box_500g',
    'Coffret Dattes 1kg (Bleu)': 'dates_gift_box_1kg',
    'Coffret Dattes 500g (Vert)': 'dates_gift_box_500g',
    'Barquette Dattes Dénoyautées 500g': 'pitted_dates_tray_500g',
    'Barquette Dattes Dénoyautées 200g': 'pitted_dates_tray_200g',
    'Figues Zidi 200g': 'dried_figs_200g',
    'Paquet de 3 Dattes' : 'three_dates_package',
  };

  // First try exact match
  if (titleToKeyMap[title]) {
    console.log(`Found exact match for '${title}': ${titleToKeyMap[title]}`);
    return titleToKeyMap[title];
  }
  
  // If no exact match, try to find a partial match
  for (const [mapTitle, key] of Object.entries(titleToKeyMap)) {
    // Check if the title contains this key phrase
    if (title.includes(mapTitle)) {
      console.log(`Found partial match for '${title}' with '${mapTitle}': ${key}`);
      return key;
    }
  }

  // If still no match, try with normalized strings (lowercase, no spaces)
  const normalizedTitle = title.toLowerCase().replace(/\s+/g, '');
  for (const [mapTitle, key] of Object.entries(titleToKeyMap)) {
    const normalizedMapTitle = mapTitle.toLowerCase().replace(/\s+/g, '');
    if (normalizedTitle.includes(normalizedMapTitle)) {
      console.log(`Found normalized match for '${title}' with '${mapTitle}': ${key}`);
      return key;
    }
  }

  console.log('No translation key found for:', title);
  return ''; // No match found
};

/**
 * Gets the full translation path for a product title
 * Returns the original title if no translation key is found
 */
export const getProductTranslationPath = (title: string): { key: string, fallback: string, descriptionKey: string } => {
  // Handle old coffret titles (remove color indicators) and old fig names
  let adjustedTitle = title;
  
  // Common title adjustments
  if (title === 'Coffret Dattes 1kg (Bleu)') {
    adjustedTitle = 'Coffret de Dattes 1kg';
  } else if (title === 'Coffret Dattes 500g (Vert)') {
    adjustedTitle = 'Coffret de Dattes 500g';
  } else if (title === 'Figues Zidi 200g') {
    adjustedTitle = 'Figues ZIDI 200g';
  } else if (title === 'Coffret Dattes 1kg') {
    adjustedTitle = 'Coffret de Dattes 1kg';
  } else if (title === 'Coffret Dattes 500g') {
    adjustedTitle = 'Coffret de Dattes 500g';
  } else if (title === 'Paquet Dattes 1kg') {
    adjustedTitle = 'Paquet de Dattes 1kg';
  } else if (title === 'Paquet Dattes 500g') {
    adjustedTitle = 'Paquet de Dattes 500g';
  } else if (title === 'Barquette Dattes Dénoyautées 500g') {
    adjustedTitle = 'Barquette de Dattes Dénoyautées 500g';
  } else if (title === 'Barquette Dattes Dénoyautées 200g') {
    adjustedTitle = 'Barquette de Dattes Dénoyautées 200g';
  } else if (title === 'Plateau de dattes' || title === 'Plateau Dattes' || title.toLowerCase().includes('plateau')) {
    adjustedTitle = 'Plateau de Dattes';
  } else if (title === 'Sirop de Dattes 340ml') {
    // Make sure this exact title is processed correctly
    adjustedTitle = 'Sirop de Dattes 340ml';
  } else if (title === 'Paquet de 3 dattes' || title.toLowerCase().includes('paquet de 3')) {
    adjustedTitle = 'Paquet de 3 dattes';
  }
  
  // Get the translation key for this adjusted title
  const translationKey = getProductTranslationKey(adjustedTitle);
  
  console.log(`Processing title '${title}', adjusted to '${adjustedTitle}', key: ${translationKey}`);
  
  // Important: Return the complete namespaced keys to use with t()
  return {
    key: translationKey ? `product_names.${translationKey}` : '',
    descriptionKey: translationKey ? `product_descriptions.${translationKey}` : '',
    fallback: adjustedTitle
  };
};

/**
 * Gets ingredient translation keys based on product type
 */
export const getProductIngredientKeys = (product: any): string[] => {
  const ingredientKeys: string[] = [];
  
  // Base ingredients based on product type
  if (product.title.includes('Dattes')) {
    ingredientKeys.push('dates');
    ingredientKeys.push('dates_no_additives');
    
    if (product.title.includes('Coffret')) {
      ingredientKeys.push('dates_premium');
      ingredientKeys.push('dates_handmade');
      ingredientKeys.push('dates_ripe');
    } else if (product.title.includes('Paquet')) {
      ingredientKeys.push('dates_no_treatment');
      ingredientKeys.push('dates_controlled_env');
    } else if (product.title.includes('Barquette')) {
      ingredientKeys.push('dates_pitted');
      ingredientKeys.push('dates_hygienic');
      ingredientKeys.push('dates_atmosphere');
    } else if (product.title.includes('Standard')) {
      ingredientKeys.push('dates_standard_quality');
      ingredientKeys.push('dates_no_artificial');
      ingredientKeys.push('dates_professional');
      ingredientKeys.push('dates_pro_packaging');
    } else if (product.title.includes('Poudre') || product.title.includes('Sucre')) {
      ingredientKeys.push('date_powder_natural');
      ingredientKeys.push('date_powder_no_additives');
      ingredientKeys.push('date_powder_dried');
      ingredientKeys.push('date_powder_ground');
    } else if (product.title.includes('Sirop')) {
      ingredientKeys.push('date_syrup_pure');
      ingredientKeys.push('date_syrup_no_additives');
      ingredientKeys.push('date_syrup_concentrated');
      ingredientKeys.push('date_syrup_natural');
    } else if (product.title.includes('Café')) {
      ingredientKeys.push('date_coffee_kernels');
      ingredientKeys.push('date_coffee_roasted');
      ingredientKeys.push('date_coffee_ground');
      ingredientKeys.push('date_coffee_natural');
    } else if (product.title.includes('Plateau')) {
      ingredientKeys.push('dates_premium');
      ingredientKeys.push('dates_selection');
      ingredientKeys.push('dates_presentation');
    }
  } else if (product.title.includes('Figues')) {
    ingredientKeys.push('dried_figs_sun');
    ingredientKeys.push('dried_figs_no_additives');
    ingredientKeys.push('dried_figs_no_sugar');
    ingredientKeys.push('dried_figs_traditional');
    
    if (product.title.includes('ZIDI') || product.title.includes('Zidi')) {
      ingredientKeys.push('dried_figs_zidi_type');
    } else if (product.title.includes('Toujane')) {
      ingredientKeys.push('dried_figs_toujane_type');
    } else if (product.title.includes('djebaa')) {
      ingredientKeys.push('dried_figs_djebaa_type');
    } else if (product.title.includes('Vrac')) {
      ingredientKeys.push('dried_figs_bulk_quality');
    }
  }
  
  return ingredientKeys;
};