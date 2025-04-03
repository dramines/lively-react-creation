
import type { Product } from '../../types/product';

export const dattesFraichesProducts: Product[] = [
  {
    id: '1',
    title: 'Paquet Dattes 1kg',
    description: 'Notre paquet de dattes Deglet Nour de 1kg offre des fruits charnus et sucrés, soigneusement sélectionnés dans les palmeraies tunisiennes. Récoltées à maturité optimale, ces dattes premium sont naturellement riches en minéraux et glucides, idéales pour une consommation quotidienne ou pour enrichir vos préparations culinaires.',
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
    description: 'Format pratique de 500g de nos dattes Deglet Nour, idéal pour les petites familles ou une consommation modérée. Ces dattes tunisiennes de première qualité se distinguent par leur texture moelleuse et leur saveur caramélisée naturelle. Parfait comme en-cas nutritif ou pour agrémenter vos pâtisseries et plats salés-sucrés.',
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
    description: 'Notre coffret premium bleu contient 1kg de dattes Deglet Nour d\'exception, soigneusement sélectionnées pour leur taille, leur brillance et leur saveur incomparable. Présentées dans un écrin élégant, ces dattes sont le cadeau parfait pour les occasions spéciales. Chaque fruit est charnu, avec une texture mielleuse et des notes subtiles de caramel naturel.',
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
    description: 'Élégant coffret vert renfermant 500g de nos dattes Deglet Nour les plus exquises. Ce format raffiné est conçu pour les amateurs de saveurs authentiques et les occasions spéciales. Chaque datte est sélectionnée pour sa texture parfaite, son goût équilibré et sa chair généreuse, faisant de ce coffret un plaisir gustatif et visuel parfait à offrir.',
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
  }
];

export const dattesTransformeesProducts: Product[] = [
  // Dattes Transformées - Barquettes
  {
    id: '5',
    title: 'Barquette Dattes Dénoyautées 500g',
    description: 'Barquette pratique de 500g de dattes Deglet Nour dénoyautées, idéale pour une consommation directe ou pour vos préparations culinaires. Ces dattes soigneusement préparées conservent toute leur saveur et leur moelleux, tout en vous offrant un gain de temps considérable. Parfaites pour vos smoothies, pâtisseries ou comme en-cas énergétique.',
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
    description: 'Format compact de 200g de dattes dénoyautées en barquette, parfait pour une consommation individuelle ou pour précisément doser vos recettes. Ces dattes Deglet Nour sans noyau sont prêtes à l\'emploi pour vos créations culinaires ou comme collation naturellement sucrée. Leur texture fondante et leur goût authentique sont préservés grâce à notre processus de dénoyautage soigneux.',
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
    description: 'Conditionnement professionnel de dattes dénoyautées disponible en formats 5kg ou 10kg, spécialement conçu pour les restaurants, les pâtisseries et les professionnels de l\'alimentation. Ces dattes Deglet Nour de qualité standard sont soigneusement dénoyautées et préparées pour une utilisation efficace en restauration. Idéales pour la préparation de desserts traditionnels, pâtisseries ou créations culinaires innovantes à grande échelle.',
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
  }
];
