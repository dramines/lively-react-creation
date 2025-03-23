
import type { ProductCategory } from '../../types/product';

export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  'dattes-fraiches': 'Dattes Fraîches',
  'dattes-transformees': 'Dattes Transformées',
  'produits-derives': 'Produits Dérivés',
  'figues-sechees': 'Figues Séchées',
  'figues-sechees-toujane': 'Figues Séchées Toujane', 
  'figues-sechees-zidi': 'Figues Séchées Toujane', 
  'figues-sechees-vrac': 'Figues Séchées Vrac',
  'figues-sechees-djebaa': 'Figues Séchées Djebaa',
  'cafe-dattes': 'Café de Dattes',
  'sucre-dattes': 'Sucre de Dattes',
  'sirop-dattes': 'Sirop de Dattes',
  'coffret-cadeaux': 'Coffrets Cadeaux',
  'dattes-en-vrac': 'Dattes en Vrac',
  'tous': 'Tous les Produits'
};

export const NAVIGATION_STRUCTURE = [
  {
    type: 'dattes',
    items: [
      { category: 'dattes-fraiches', image: '/produits/PaquetDattes.png' },
      { category: 'dattes-transformees', image: '/produits/braquette500gram.png' }
    ]
  },
  {
    type: 'produits-derives',
    items: [
      { category: 'cafe-dattes', image: '/produits/cafe-dattes.png' },
      { category: 'sucre-dattes', image: '/produits/sucre-dattes.png' },
      { category: 'sirop-dattes', image: '/produits/sirop-dattes.png' }
    ]
  },
  {
    type: 'figues',
    items: [
      { category: 'figues-sechees', image: '/produits/figues-sechees.png' }
    ]
  }
];
