
export type ProductCategory = 
  | 'dattes-fraiches'
  | 'dattes-transformees'
  | 'dattes-en-vrac'
  | 'dattes-farcies' 
  | 'technical-products' 
  | 'produits-derives'
  | 'figues-sechees'
  | 'figues-sechees-toujane'
  | 'figues-sechees-zidi'
  | 'figues-sechees-vrac'
  | 'figues-sechees-djebaa'
  | 'cafe-dattes'
  | 'sucre-dattes'
  | 'sirop-dattes'
  | 'coffret-cadeaux'
  | 'tous';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ProductCategory;
  subcategory?: string;
  certifications: string[];
  price?: string;
  weight?: string;
  isOrganic: boolean;
  isFairTrade: boolean;
  calories?: {
    value: number;
    unit: string;
    per: string;
  };
  nutritionFacts?: {
    name: string;
    value: string;
    unit: string;
    dailyValue?: string;
  }[];
  ingredients?: string[];
}

export interface DateComposition {
  dateOptions: string[];
  quantity: number;
}

export interface DateOption {
  id: string;
  name: string;
  image: string;
  type: string;
}
