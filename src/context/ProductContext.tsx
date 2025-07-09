
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItemGroupSizeType, getSizeFieldsForItemGroup, getSizeLabelsForItemGroup, needsSizeSelection } from '@/config/productSizeConfig';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  description: string;
  isNew: boolean;
  isOnSale: boolean;
  rating: number;
  reviews: number;
  stock: number;
  // Additional fields for size logic
  itemgroup_product?: string;
  xs_size?: string;
  s_size?: string;
  m_size?: string;
  l_size?: string;
  xl_size?: string;
  xxl_size?: string;
  '3xl_size'?: string;
  '4xl_size'?: string;
  '48_size'?: string;
  '50_size'?: string;
  '52_size'?: string;
  '54_size'?: string;
  '56_size'?: string;
  '58_size'?: string;
  qnty_product?: string;
}

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    size: string;
    color: string;
    sortBy: string;
  };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: any) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | null>(null);

// Helper function to get product image URL
const getProductImage = (imagePath: string, productId: string): string => {
  if (!imagePath) {
    return `https://draminesaid.com/lucci/uploads/default-product.jpg`;
  }
  
  // If the image path already includes the full URL, use it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Construct the full URL with the base URL
  return `https://draminesaid.com/lucci/${imagePath}`;
};

// Helper function to get available sizes from size fields using configuration
const getAvailableSizes = (product: any): string[] => {
  if (!product.itemgroup_product) {
    return ['S', 'M', 'L', 'XL']; // Default fallback
  }

  if (!needsSizeSelection(product.itemgroup_product)) {
    return []; // No sizes needed for quantity-only products
  }

  const sizeFields = getSizeFieldsForItemGroup(product.itemgroup_product);
  const sizeLabels = getSizeLabelsForItemGroup(product.itemgroup_product);
  const availableSizes: string[] = [];

  sizeFields.forEach((field, index) => {
    const sizeValue = product[field];
    if (sizeValue && parseInt(sizeValue) > 0) {
      availableSizes.push(sizeLabels[index]);
    }
  });

  return availableSizes.length > 0 ? availableSizes : ['M', 'L', 'XL'];
};

// Fetch products from API
const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from API...');
    const response = await fetch('https://draminesaid.com/lucci/api/get_exclusive_collection.php');
    const result = await response.json();
    
    console.log('API Response:', result);
    
    if (result.success && result.data) {
      // Transform API data to match our Product interface
      const transformedProducts = result.data.map((item: any) => {
        const availableSizes = getAvailableSizes(item);
        const discountAmount = item.discount_product ? parseFloat(item.discount_product) : 0;
        const basePrice = parseFloat(item.price_product);
        const discountedPrice = discountAmount > 0 ? basePrice * (1 - discountAmount / 100) : basePrice;
        
        return {
          id: item.id_product.toString(),
          name: item.nom_product,
          price: discountedPrice,
          originalPrice: discountAmount > 0 ? basePrice : undefined,
          image: getProductImage(item.img_product, item.id_product.toString()),
          images: [
            getProductImage(item.img_product, item.id_product.toString()),
            getProductImage(item.img2_product, item.id_product.toString()),
            getProductImage(item.img3_product, item.id_product.toString()),
            getProductImage(item.img4_product, item.id_product.toString())
          ].filter(Boolean),
          category: item.category_product || item.itemgroup_product || 'Prêt-à-porter',
          sizes: availableSizes,
          colors: item.color_product ? [item.color_product] : ['Navy', 'Black', 'White'],
          description: item.description_product || item.nom_product,
          isNew: new Date(item.createdate_product) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isOnSale: discountAmount > 0,
          rating: 4.8,
          reviews: Math.floor(Math.random() * 100) + 20,
          stock: parseInt(item.qnty_product) || 10,
          // Include all size and itemgroup data for size logic
          itemgroup_product: item.itemgroup_product,
          xs_size: item.xs_size,
          s_size: item.s_size,
          m_size: item.m_size,
          l_size: item.l_size,
          xl_size: item.xl_size,
          xxl_size: item.xxl_size,
          '3xl_size': item['3xl_size'],
          '4xl_size': item['4xl_size'],
          '48_size': item['48_size'],
          '50_size': item['50_size'],
          '52_size': item['52_size'],
          '54_size': item['54_size'],
          '56_size': item['56_size'],
          '58_size': item['58_size'],
          qnty_product: item.qnty_product
        };
      });
      
      console.log('Transformed products:', transformedProducts);
      return transformedProducts;
    }
    
    console.log('API call unsuccessful or no data');
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fallback mock products for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Costume Trois Pièces Milano',
    price: 2890,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
    ],
    category: 'Costumes',
    sizes: ['46', '48', '50', '52', '54', '56'],
    colors: ['Bleu Marine', 'Charbon', 'Anthracite'],
    description: 'Costume trois pièces confectionné à la main dans nos ateliers milanais. Laine Super 150s, coupe sartoriale traditionnelle avec finitions main couture.',
    isNew: false,
    isOnSale: true,
    rating: 4.9,
    reviews: 87,
    stock: 8
  },
  {
    id: '2',
    name: 'Chemise Napoli Cotton',
    price: 245,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop'
    ],
    category: 'Chemises',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Blanc', 'Bleu Ciel', 'Rose Poudré'],
    description: 'Chemise en coton égyptien 100% façonnée selon la tradition napolitaine. Col italien, poignets mousquetaires, coutures roulottées main.',
    isNew: true,
    isOnSale: false,
    rating: 4.8,
    reviews: 124,
    stock: 15
  },
  {
    id: '3',
    name: 'Veste Smoking Venezia',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop'
    ],
    category: 'Smoking',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Noir', 'Bleu Minuit'],
    description: 'Veste de smoking en laine mohair avec revers en soie. Confection artisanale vénitienne, boutonnière fonctionnelle, doublure jacquard.',
    isNew: false,
    isOnSale: false,
    rating: 4.9,
    reviews: 56,
    stock: 6
  },
  {
    id: '4',
    name: 'Manteau Cachemire Firenze',
    price: 2450,
    originalPrice: 2890,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1583743089696-4b3ccb4b7ad3?w=400&h=500&fit=crop'
    ],
    category: 'Manteaux',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Camel', 'Gris Anthracite', 'Bleu Marine'],
    description: 'Manteau en pur cachemire de Mongolie, doublure en soie. Coupe droite florentine, col italien, finitions main couture.',
    isNew: true,
    isOnSale: true,
    rating: 4.9,
    reviews: 43,
    stock: 4
  },
  {
    id: '5',
    name: 'Costume Cérémonie Roma',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop'
    ],
    category: 'Costumes',
    sizes: ['46', '48', '50', '52', '54', '56'],
    colors: ['Gris Perle', 'Charbon', 'Bleu Nuit'],
    description: 'Costume de cérémonie en laine Super 180s. Confection romaine traditionnelle, gilet assorti, détails en nacre véritable.',
    isNew: false,
    isOnSale: false,
    rating: 5.0,
    reviews: 28,
    stock: 3
  },
  {
    id: '6',
    name: 'Cravate Soie Como',
    price: 185,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop'
    ],
    category: 'Accessoires',
    sizes: ['Unique'],
    colors: ['Bordeaux', 'Bleu Marine', 'Vert Bouteille', 'Argenté'],
    description: 'Cravate en pure soie de Côme, tissage jacquard traditionnel. Motifs géométriques exclusifs, finition main roulottée.',
    isNew: true,
    isOnSale: false,
    rating: 4.7,
    reviews: 92,
    stock: 25
  },
  {
    id: '7',
    name: 'Pochette Soie Pura',
    price: 95,
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=500&fit=crop'
    ],
    category: 'Accessoires',
    sizes: ['Unique'],
    colors: ['Blanc', 'Champagne', 'Bleu Ciel', 'Rose'],
    description: 'Pochette de costume en soie pure italienne. Pliage traditionnel, bords roulottés main, motifs floraux délicats.',
    isNew: false,
    isOnSale: false,
    rating: 4.6,
    reviews: 67,
    stock: 18
  },
  {
    id: '8',
    name: 'Gilet Laine Torino',
    price: 890,
    image: 'https://images.unsplash.com/photo-1583743089696-4b3ccb4b7ad3?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583743089696-4b3ccb4b7ad3?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop'
    ],
    category: 'Gilets',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Gris Chiné', 'Bleu Marine', 'Beige'],
    description: 'Gilet en laine mérinos, confection turinoise. Dos en soie, boutons en corne naturelle, ajustement parfait.',
    isNew: true,
    isOnSale: false,
    rating: 4.8,
    reviews: 34,
    stock: 12
  }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  
  useEffect(() => {
    fetchProducts().then(apiProducts => {
      if (apiProducts.length > 0) {
        setProducts(apiProducts);
      }
    });
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 5000,
    size: '',
    color: '',
    sortBy: 'name'
  });

  const updateFilters = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    const matchesSize = !filters.size || product.sizes.includes(filters.size);
    const matchesColor = !filters.color || product.colors.includes(filters.color);

    return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesColor;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew ? 1 : -1;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts,
      filters,
      searchQuery,
      setSearchQuery,
      updateFilters,
      getProductById,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
