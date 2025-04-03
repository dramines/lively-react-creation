
export type ClientType = 'B2B' | 'B2C' | null;

export type NavItem = {
  label: string;
  href: string;
};

export type Language = 'en' | 'fr';

export type ProductType = 
  | 'dattes'
  | 'figues-sechees'
  | 'sirops'
  | 'sucre-dattes'
  | 'cafe-dattes';

export type ProductCategory = 
  | 'coffret-cadeaux'
  | 'paquets'
  | 'dattes-en-vrac'
  | 'figues-sechees-huile-olive'
  | 'figues-sechees-en-vrac'
  | 'sirop-dattes'
  | 'sirop-figues'
  | 'sucre-dattes'
  | 'cafe-dattes'
  | 'tous';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  isOrganic: boolean;
  isFairTrade: boolean;
  type: ProductType;
  category: ProductCategory;
  price?: number;  // Added price as optional
  details?: string; // Added details as optional
}
