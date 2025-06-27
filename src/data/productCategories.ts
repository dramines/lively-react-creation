
// Product Categories Reference
// This file contains all the different categories, types, and item groups used in the product database

export const PRODUCT_CATEGORIES = {
  // Main Categories
  HOMME: 'homme',
  FEMME: 'femme',
  EMPTY: '', // For pretAPorter and accessoires
} as const;

export const PRODUCT_TYPES = {
  SUR_MESURE: 'sur mesure',
  PRET_A_PORTER: 'pret a porter',
  ACCESSOIRES: 'accessoires',
} as const;

export const ITEM_GROUPS = {
  // Sur Mesure - Homme
  BLAZERS: 'blazers',
  BLOUSON: 'blouson',
  MANTEAU: 'manteau',
  DJINE: 'djine',
  SLACK: 'slack',
  PANTALON: 'pantalon',
  
  // Sur Mesure - Femme
  CHEMISE: 'chemise',
  COSTUME: 'costume',
  BLAZER: 'blazer',
  
  // Prêt à Porter
  TSHIRT: 'tshirt',
  POLO: 'polo',
  CHAUSSURE: 'chaussure',
  CEINTURE: 'ceinture',
  MAROQUINERIE: 'maroquinerie',
  
  // Accessoires
  CRAVATE: 'cravate',
  POCHETTE: 'pochette',
  AUTRE: 'autre',
} as const;

// URL Structure Mapping
export const URL_TO_CATEGORY_MAPPING = {
  // Sur Mesure
  'surMesure/homme-blazers': { category: 'homme', itemgroup: 'blazers' },
  'surMesure/homme-blouson': { category: 'homme', itemgroup: 'blouson' },
  'surMesure/homme-manteau': { category: 'homme', itemgroup: 'manteau' },
  'surMesure/homme-djine': { category: 'homme', itemgroup: 'djine' },
  'surMesure/homme-slack': { category: 'homme', itemgroup: 'slack' },
  'surMesure/homme-pantalon': { category: 'homme', itemgroup: 'pantalon' },
  'surMesure/femme-chemise': { category: 'femme', itemgroup: 'chemise' },
  'surMesure/femme-costume': { category: 'femme', itemgroup: 'costume' },
  'surMesure/femme-blazer': { category: 'femme', itemgroup: 'blazer' },
  
  // Prêt à Porter
  'pretAPorter/chemise': { category: '', itemgroup: 'chemise' },
  'pretAPorter/tshirt': { category: '', itemgroup: 'tshirt' },
  'pretAPorter/polo': { category: '', itemgroup: 'polo' },
  'pretAPorter/chaussure': { category: '', itemgroup: 'chaussure' },
  'pretAPorter/ceinture': { category: '', itemgroup: 'ceinture' },
  'pretAPorter/maroquinerie': { category: '', itemgroup: 'maroquinerie' },
  
  // Accessoires
  'accessoires/cravate': { category: '', itemgroup: 'cravate' },
  'accessoires/pochette': { category: '', itemgroup: 'pochette' },
  'accessoires/maroquinerie': { category: '', itemgroup: 'maroquinerie' },
  'accessoires/autre': { category: '', itemgroup: 'autre' },
} as const;

// Size mapping for different product types
export const SIZE_FIELDS = {
  // Standard clothing sizes
  STANDARD: ['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size'],
  
  // Suit/formal wear sizes (European sizing)
  FORMAL: ['48_size', '50_size', '52_size', '54_size', '56_size', '58_size'],
} as const;

// Get appropriate size fields based on item group
export const getSizeFieldsForItemGroup = (itemgroup: string): string[] => {
  const formalItems = ['blazers', 'blouson', 'manteau', 'costume', 'blazer', 'djine', 'slack', 'pantalon'];
  
  if (formalItems.includes(itemgroup)) {
    return [...SIZE_FIELDS.FORMAL];
  }
  
  return [...SIZE_FIELDS.STANDARD];
};

// Convert size field names to display names
export const SIZE_DISPLAY_NAMES: Record<string, string> = {
  'xs_size': 'XS',
  's_size': 'S',
  'm_size': 'M',
  'l_size': 'L',
  'xl_size': 'XL',
  'xxl_size': 'XXL',
  '3xl_size': '3XL',
  '4xl_size': '4XL',
  '48_size': '48',
  '50_size': '50',
  '52_size': '52',
  '54_size': '54',
  '56_size': '56',
  '58_size': '58',
};
