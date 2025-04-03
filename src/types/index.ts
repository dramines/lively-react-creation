
export type ClientType = 'B2B' | 'B2C' | null;

export type NavItem = {
  label: string;
  href: string;
};

export type Language = 'en' | 'fr';

export type ProductCategory = 'tous' | 'dattes-fraiches' | 'dattes-transformees' | 'produits-derives' | 'dattes-farcies';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  isOrganic: boolean;
  isFairTrade: boolean;
  category?: ProductCategory;
}
