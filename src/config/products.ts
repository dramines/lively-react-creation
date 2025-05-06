import type { Product, ProductCategory } from '../types/product';

export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  'dattes-fraiches': 'Dattes Fraîches',
  'dattes-transformees': 'Dattes Transformées',
  'produits-derives': 'Produits Dérivés',
  'dattes-farcies': 'Dattes Farcies',
  'technical-products': 'Technical Products',
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
      { category: 'dattes-transformees', image: '/produits/braquette500gram.png' },
      { category: 'dattes-farcies', image: '/produits/PaquetDattes.png' }
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

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Paquet Dattes 1kg',
    description: '',
        image: '/produits/PaquetDattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'paquet',
    certifications: ['Bio', 'Fair Trade'],
    weight: '1kg',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie 100% naturelles',
      'Sans additifs ni conservateurs',
      'Non traitées après récolte',
      'Conditionnées dans un environnement contrôlé'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '2',
    title: 'Paquet Dattes 500g',
    description: '',
        image: '/produits/PaquetDattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'paquet',
    certifications: ['Bio', 'Fair Trade'],
    weight: '500g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie 100% naturelles',
      'Sans additifs ni conservateurs',
      'Non traitées après récolte',
      'Emballées sous atmosphère protectrice'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Dattes - Coffrets
  {
    id: '3',
    title: 'Coffret de Dattes 1kg',
    description: '',
        image: '/produits/PaquetDattesBlue.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'coffret-cadeaux',
    certifications: ['Bio', 'Fair Trade'],
    weight: '1kg',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour premium de Tunisie sélection supérieure',
      'Sans additifs ni conservateurs',
      'Conditionnées à la main',
      'Récoltées à pleine maturité et triées individuellement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '4',
    title: 'Coffret Dattes 500g (Vert)',
    description: '',
        image: '/produits/PaquetDattesVerte.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'coffret-cadeaux',
    certifications: ['Bio', 'Fair Trade'],
    weight: '500g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour premium de Tunisie sélection supérieure',
      'Sans additifs ni conservateurs',
      'Conditionnées à la main',
      'Récoltées à pleine maturité et triées individuellement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Dattes Transformées - Barquettes
  {
    id: '5',
    title: 'Barquette Dattes Dénoyautées 500g',
    description: '',
        image: '/produits/braquette500gram.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-transformees',
    subcategory: 'barquette',
    certifications: ['Bio', 'Fair Trade'],
    weight: '500g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie dénoyautées',
      'Sans additifs ni conservateurs',
      'Préparées dans des conditions d\'hygiène optimales',
      'Emballées sous atmosphère protectrice pour préserver leur fraîcheur'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '6',
    title: 'Barquette Dattes Dénoyautées 200g',
    description: '',
        image: '/produits/BarquetteDattesDen200g2.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-transformees',
    subcategory: 'barquette',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie dénoyautées',
      'Sans additifs ni conservateurs',
      'Préparées dans des conditions d\'hygiène optimales',
      'Conditionnement hermétique pour une fraîcheur maximale'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '7',
    title: 'Dattes Standard Dénoyautées 5kg/10kg',
    description: '',
        image: '/produits/DattesStandard.png',
    isOrganic: false,
    isFairTrade: true,
    category: 'dattes-transformees',
    certifications: ['Fair Trade'],
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie dénoyautées qualité standard',
      'Sans conservateurs artificiels',
      'Préparées selon les normes d\'hygiène professionnelles',
      'Conditionnement spécial pour usage professionnel'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Figues Séchées
  {
    id: '9',
    title: 'Figues ZIDI 200g',
    description: '',  
      image: '/produits/zidi-figues.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees-zidi',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Séchées selon des méthodes traditionnelles respectueuses de l\'environnement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '10',
    title: 'Figues Séchées en Vrac',
    description: '',
        image: '/produits/figuesvrac.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees-vrac',
    certifications: ['Bio', 'Fair Trade'],
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Sélectionnées à la main pour garantir leur qualité'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '14',
    title: 'Figues Toujane 200g',
    description: '',
        image: '/produits/toujane-figues.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees-toujane',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues Toujane de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Séchées selon des méthodes traditionnelles respectueuses de l\'environnement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '15',
    title: 'Figues djebaa 200g',
    description: '',
    image: '/produits/djebba-figues.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees-djebaa',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues djebaa de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Séchées selon des méthodes traditionnelles respectueuses de l\'environnement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '11',
    title: 'Café de Noyaux de Dattes 200g',
    description: '',
        image: '/produits/cafe-dattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'cafe-dattes',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 15,
      unit: 'kcal/63kJ',
      per: '100g'
    },
    ingredients: [
      'Noyaux de dattes Deglet Nour torréfiés et finement moulus (100%)',
      'Sans additifs ni arômes',
      'Sans caféine naturellement',
      'Torréfaction artisanale à basse température pour préserver les arômes'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '15', 
        unit: 'kcal/63kJ',
        dailyValue: '0.75%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '0.5', 
        unit: 'g',
        dailyValue: '0.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '0.5', 
        unit: 'g',
        dailyValue: '0.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '2.8', 
        unit: 'g',
        dailyValue: '11.2%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '2.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.1', 
        unit: 'g',
        dailyValue: '0.14%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.05', 
        unit: 'g',
        dailyValue: '0.25%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '12',
    title: 'Poudre (Sucre) de Dattes 300g',
    description: '',   
    image: '/produits/sucre-dattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'sucre-dattes',
    certifications: ['Bio', 'Fair Trade'],
    weight: '300g',
    calories: {
      value: 380,
      unit: 'kcal/1590kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie déshydratées et réduites en poudre (100%)',
      'Sans additifs ni conservateurs',
      'Sans sucres ajoutés',
      'Produit dans une unité dédiée aux produits naturels'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '380', 
        unit: 'kcal/1590kJ',
        dailyValue: '19%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '90', 
        unit: 'g',
        dailyValue: '34.6%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '90', 
        unit: 'g',
        dailyValue: '100%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '8', 
        unit: 'g',
        dailyValue: '32%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.5', 
        unit: 'g',
        dailyValue: '5%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.5', 
        unit: 'g',
        dailyValue: '0.71%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.1', 
        unit: 'g',
        dailyValue: '0.5%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '13',
    title: 'Sirop de Dattes 340ml',
    description: '',
    image: '/produits/sirop-dattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'sirop-dattes',
    certifications: ['Bio', 'Fair Trade'],
    calories: {
      value: 290,
      unit: 'kcal/1213kJ',
      per: '100g'
    },
    ingredients: [
      'Pulpe de dattes Deglet Nour de Tunisie (100%)',
      'Sans additifs ni conservateurs',
      'Sans sucres ajoutés',
      'Extrait à froid pour préserver nutriments et saveurs'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '290', 
        unit: 'kcal/1213kJ',
        dailyValue: '14.5%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '72', 
        unit: 'g',
        dailyValue: '27.7%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '72', 
        unit: 'g',
        dailyValue: '80%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '0', 
        unit: 'g',
        dailyValue: '0%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '0.7', 
        unit: 'g',
        dailyValue: '1.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.1', 
        unit: 'g',
        dailyValue: '0.14%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0', 
        unit: 'g',
        dailyValue: '0%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '16',  // Changing to unique ID
    title: 'Paquet de 3 dattes',
    description: 'Paquet de dégustation contenant 3 dattes Deglet Nour de qualité supérieure. Idéal pour une petite dégustation ou comme échantillon de nos produits phares. Ces dattes sont soigneusement sélectionnées pour leur texture moelleuse et leur goût exquis, offrant une expérience gustative authentique.',
    image: '/produits/3dattes-dattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'technical-products',
    certifications: ['Bio', 'Fair Trade'],
    calories: {
      value: 290,
      unit: 'kcal/1213kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie (100%)',
      'Sans additifs ni conservateurs',
      'Sans sucres ajoutés',
      'Emballage minimal et écologique'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '290', 
        unit: 'kcal/1213kJ',
        dailyValue: '14.5%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '72', 
        unit: 'g',
        dailyValue: '27.7%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '72', 
        unit: 'g',
        dailyValue: '80%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '1.8', 
        unit: 'g',
        dailyValue: '7.2%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '0.7', 
        unit: 'g',
        dailyValue: '1.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.1', 
        unit: 'g',
        dailyValue: '0.14%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0', 
        unit: 'g',
        dailyValue: '0%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '17',  // Changing to unique ID
    title: 'Plateau de dattes',
    description: 'Disponible en plateau de 3 et 6 kg,élégant plateau de présentation contenant une sélection de nos meilleures dattes Deglet Nour. Parfait pour les réceptions, les événements spéciaux ou comme cadeau raffiné. Ce plateau est préparé avec soin pour mettre en valeur la beauté naturelle et la qualité supérieure de nos dattes tunisiennes.',
    image: '/produits/plateau-dattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'technical-products',
    certifications: ['Bio', 'Fair Trade'],
    calories: {
      value: 290,
      unit: 'kcal/1213kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour sélection premium de Tunisie (100%)',
      'Sans additifs ni conservateurs',
      'Présentées dans un plateau artisanal traditionnel',
      'Sélectionnées et disposées à la main'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '290', 
        unit: 'kcal/1213kJ',
        dailyValue: '14.5%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '72', 
        unit: 'g',
        dailyValue: '27.7%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '72', 
        unit: 'g',
        dailyValue: '80%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '1.8', 
        unit: 'g',
        dailyValue: '7.2%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '0.7', 
        unit: 'g',
        dailyValue: '1.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.1', 
        unit: 'g',
        dailyValue: '0.14%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0', 
        unit: 'g',
        dailyValue: '0%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  }
];