export interface Reseller {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  coordinates: [number, number];
  suppliers: string[];
}

export const RESELLERS_DATA: Reseller[] = [
  {
    id: 1,
    name: "Ben Yaghlen Tunis Centre",
    address: "123 Avenue Habib Bourguiba, Tunis",
    phone: "+216 71 123 456",
    email: "tunis@benyaghlen.tn",
    image: "benyaghlen.jpg"
  },
  {
    id: 2,
    name: "Carrefour La Marsa",
    address: "45 Avenue de la Plage, La Marsa",
    phone: "+216 71 789 012",
    email: "marsa@carrefour.tn",
    image: "Carrefour-Tunisie.png"
  },
  {
    id: 3,
    name: "Géant Tunis City",
    address: "Centre Commercial Tunis City, Tunis",
    phone: "+216 73 456 789",
    email: "tunis@geant.tn",
    image: "geant.jpg"
  }
];

export const suppliers: Supplier[] = [
  {
    id: 'benyaghlen',
    name: 'Ben Yaghlen',
    logo: 'benyaghlen.jpg',
    description: 'Réseau de superettes de proximité en Tunisie'
  },
  {
    id: 'carrefour',
    name: 'Carrefour',
    logo: 'Carrefour-Tunisie.png',
    description: 'Hypermarché international présent dans toute la Tunisie'
  },
  {
    id: 'geant',
    name: 'Géant',
    logo: 'geant.jpg',
    description: 'Grande surface offrant une large gamme de produits alimentaires'
  },
  {
    id: 'monoprix',
    name: 'Monoprix',
    logo: 'monoprix.png',
    description: 'Supermarché premium avec des produits de qualité'
  },
  {
    id: 'saveurs-carthage',
    name: 'Les Saveurs de Carthage',
    logo: 'saveurs-carthage.png',
    description: 'Épicerie fine proposant des produits locaux de qualité à Carthage'
  },
  {
    id: 'la-firma',
    name: 'La Firma',
    logo: 'la-firma.png',
    description: 'Boutique gourmande située à Hammamet offrant une sélection de produits premium'
  },
  {
    id: 'mazraa-market',
    name: 'Mazraa Market',
    logo: 'mazraa-market.png',
    description: 'Supermarché à Grand Tunis proposant une large gamme de produits alimentaires'
  },
  {
    id: 'anoir',
    name: 'Anoir',
    logo: 'anoir.png',
    description: 'Épicerie traditionnelle à Hammamet, Grand Tunis, spécialisée en produits locaux'
  },
  {
    id: 'belgueyed-hassine',
    name: 'Belgueyed Hassine',
    logo: 'belgueyed-hassine.png',
    description: 'Épicerie de quartier familiale située à Ariana offrant des produits frais et locaux'
  },
  {
    id: 'ayem-zmen',
    name: 'Ayem Zmen',
    logo: 'ayem-zmen.png',
    description: 'Magasin spécialisé dans les produits traditionnels tunisiens à La Marsa'
  }
];

export const stores: Store[] = [
  {
    id: 1,
    name: "Ben Yaghlen Tunis Centre",
    address: "123 Avenue Habib Bourguiba, Tunis",
    coordinates: [36.8065, 10.1815],
    suppliers: ['benyaghlen']
  },
  {
    id: 2,
    name: "Ben Yaghlen La Marsa",
    address: "45 Avenue de la Plage, La Marsa",
    coordinates: [36.8892, 10.3229],
    suppliers: ['benyaghlen']
  },
  {
    id: 3,
    name: "Ben Yaghlen Sousse",
    address: "78 Avenue du 14 Janvier, Sousse",
    coordinates: [35.8288, 10.6405],
    suppliers: ['benyaghlen']
  },
  {
    id: 4,
    name: "Ben Yaghlen Sfax",
    address: "156 Route de l'Aéroport, Sfax",
    coordinates: [34.7478, 10.7661],
    suppliers: ['benyaghlen']
  },
  {
    id: 5,
    name: "Ben Yaghlen Monastir",
    address: "23 Avenue Habib Bourguiba, Monastir",
    coordinates: [35.7710, 10.8324],
    suppliers: ['benyaghlen']
  },
  {
    id: 6,
    name: "Ben Yaghlen Bizerte",
    address: "87 Avenue Habib Bourguiba, Bizerte",
    coordinates: [37.2744, 9.8739],
    suppliers: ['benyaghlen']
  },
  {
    id: 7,
    name: "Ben Yaghlen Nabeul",
    address: "45 Avenue de la République, Nabeul",
    coordinates: [36.4512, 10.7357],
    suppliers: ['benyaghlen']
  },
  {
    id: 8,
    name: "Ben Yaghlen Hammamet",
    address: "34 Avenue des Jasmins, Hammamet",
    coordinates: [36.3995, 10.6140],
    suppliers: ['benyaghlen']
  },
  
  // Carrefour locations - Extended
  {
    id: 9,
    name: "Carrefour La Marsa",
    address: "Centre Commercial Zéphyr, La Marsa",
    coordinates: [36.8812, 10.3230],
    suppliers: ['carrefour']
  },
  {
    id: 10,
    name: "Carrefour Tunis City",
    address: "Centre Commercial Tunis City, Tunis",
    coordinates: [36.8499, 10.2041],
    suppliers: ['carrefour']
  },
  {
    id: 11,
    name: "Carrefour Sousse",
    address: "Centre Commercial Sousse Mall, Sousse",
    coordinates: [35.8354, 10.6257],
    suppliers: ['carrefour']
  },
  {
    id: 12,
    name: "Carrefour Sfax",
    address: "Centre Commercial Sfax Center, Sfax",
    coordinates: [34.7399, 10.7553],
    suppliers: ['carrefour']
  },
  {
    id: 13,
    name: "Carrefour Nabeul",
    address: "Zone Touristique El Maamoura, Nabeul",
    coordinates: [36.4588, 10.7408],
    suppliers: ['carrefour']
  },
  {
    id: 14,
    name: "Carrefour Bizerte",
    address: "Route de Tunis, Bizerte",
    coordinates: [37.2789, 9.8677],
    suppliers: ['carrefour']
  },
  
  // Géant locations - Extended
  {
    id: 15,
    name: "Géant Tunis City",
    address: "Route de La Marsa, Tunis",
    coordinates: [36.8520, 10.2100],
    suppliers: ['geant']
  },
  {
    id: 16,
    name: "Géant La Soukra",
    address: "Route de la Soukra, Tunis",
    coordinates: [36.8740, 10.2370],
    suppliers: ['geant']
  },
  {
    id: 17,
    name: "Géant Sousse",
    address: "Boulevard du 14 Janvier, Sousse",
    coordinates: [35.8301, 10.6381],
    suppliers: ['geant']
  },
  {
    id: 18,
    name: "Géant Sfax",
    address: "Route de Tunis Km 3, Sfax",
    coordinates: [34.7482, 10.7598],
    suppliers: ['geant']
  },
  {
    id: 19,
    name: "Géant Monastir",
    address: "Zone Touristique Skanes, Monastir",
    coordinates: [35.7684, 10.8232],
    suppliers: ['geant']
  },
  
  // Monoprix locations - Extended
  {
    id: 20,
    name: "Monoprix La Marsa",
    address: "Avenue Habib Bourguiba, La Marsa",
    coordinates: [36.8800, 10.3240],
    suppliers: ['monoprix']
  },
  {
    id: 21,
    name: "Monoprix Menzah 6",
    address: "Avenue Habib Bourguiba, Menzah 6",
    coordinates: [36.8459, 10.1686],
    suppliers: ['monoprix']
  },
  {
    id: 22,
    name: "Monoprix El Manar",
    address: "Centre Commercial El Manar, Tunis",
    coordinates: [36.8372, 10.1612],
    suppliers: ['monoprix']
  },
  {
    id: 23,
    name: "Monoprix Lac 2",
    address: "Centre Commercial Lac 2, Tunis",
    coordinates: [36.8323, 10.2747],
    suppliers: ['monoprix']
  },
  {
    id: 24,
    name: "Monoprix Sousse",
    address: "Avenue du 14 Janvier, Sousse",
    coordinates: [35.8245, 10.6344],
    suppliers: ['monoprix']
  },
  {
    id: 25,
    name: "Monoprix Hammamet",
    address: "Avenue Habib Bourguiba, Hammamet",
    coordinates: [36.4023, 10.6107],
    suppliers: ['monoprix']
  },
  {
    id: 26,
    name: "Monoprix Sfax",
    address: "Avenue de Carthage, Sfax",
    coordinates: [34.7436, 10.7608],
    suppliers: ['monoprix']
  },
  {
    id: 27,
    name: "Monoprix Bizerte",
    address: "Avenue Habib Bourguiba, Bizerte",
    coordinates: [37.2765, 9.8699],
    suppliers: ['monoprix']
  },
  {
    id: 28,
    name: "Monoprix Nabeul",
    address: "Avenue Habib Bourguiba, Nabeul",
    coordinates: [36.4525, 10.7345],
    suppliers: ['monoprix']
  },
  {
    id: 29,
    name: "Monoprix Djerba",
    address: "Zone Touristique Midoun, Djerba",
    coordinates: [33.8075, 10.9877],
    suppliers: ['monoprix']
  },
  {
    id: 30,
    name: "Monoprix Gabès",
    address: "Avenue Habib Bourguiba, Gabès",
    coordinates: [33.8833, 10.0982],
    suppliers: ['monoprix']
  },
  {
    id: 31,
    name: "Ben Yaghlen Ariana",
    address: "45 Rue de la République, Ariana",
    coordinates: [36.8660, 10.1890],
    suppliers: ['benyaghlen']
  },
  {
    id: 32,
    name: "Ben Yaghlen Beja",
    address: "12 Avenue Habib Bourguiba, Beja",
    coordinates: [36.7250, 9.1835],
    suppliers: ['benyaghlen']
  },
  {
    id: 33,
    name: "Ben Yaghlen Kairouan",
    address: "56 Rue Mongi Slim, Kairouan",
    coordinates: [35.6781, 9.8764],
    suppliers: ['benyaghlen']
  },
  {
    id: 34,
    name: "Ben Yaghlen Tozeur",
    address: "89 Avenue Habib Bourguiba, Tozeur",
    coordinates: [33.9016, 8.1292],
    suppliers: ['benyaghlen']
  },
  {
    id: 35,
    name: "Ben Yaghlen Tataouine",
    address: "23 Rue Farhat Hached, Tataouine",
    coordinates: [32.9306, 10.4993],
    suppliers: ['benyaghlen']
  },

  // Carrefour locations - Extended
  {
    id: 36,
    name: "Carrefour Ariana",
    address: "Centre Commercial Ariana City, Ariana",
    coordinates: [36.8665, 10.1980],
    suppliers: ['carrefour']
  },
  {
    id: 37,
    name: "Carrefour Beja",
    address: "Centre Commercial Beja Mall, Beja",
    coordinates: [36.7255, 9.1838],
    suppliers: ['carrefour']
  },
  {
    id: 38,
    name: "Carrefour Kairouan",
    address: "Centre Commercial Kairouan Plaza, Kairouan",
    coordinates: [35.6785, 9.8768],
    suppliers: ['carrefour']
  },
  {
    id: 39,
    name: "Carrefour Tozeur",
    address: "Centre Commercial Tozeur Oasis, Tozeur",
    coordinates: [33.9020, 8.1295],
    suppliers: ['carrefour']
  },
  {
    id: 40,
    name: "Carrefour Tataouine",
    address: "Centre Commercial Tataouine Center, Tataouine",
    coordinates: [32.9310, 10.4995],
    suppliers: ['carrefour']
  },

  // Géant locations - Extended
  {
    id: 41,
    name: "Géant Ariana",
    address: "Route de Tunis, Ariana",
    coordinates: [36.8660, 10.1895],
    suppliers: ['geant']
  },
  {
    id: 42,
    name: "Géant Beja",
    address: "Route de Tunis, Beja",
    coordinates: [36.7250, 9.1830],
    suppliers: ['geant']
  },
  {
    id: 43,
    name: "Géant Kairouan",
    address: "Route de Kairouan, Kairouan",
    coordinates: [35.6780, 9.8760],
    suppliers: ['geant']
  },
  {
    id: 44,
    name: "Géant Tozeur",
    address: "Route de Tozeur, Tozeur",
    coordinates: [33.9015, 8.1290],
    suppliers: ['geant']
  },
  {
    id: 45,
    name: "Géant Tataouine",
    address: "Route de Tataouine, Tataouine",
    coordinates: [32.9305, 10.4990],
    suppliers: ['geant']
  },

  // Monoprix locations - Extended
  {
    id: 46,
    name: "Monoprix Ariana",
    address: "Avenue Habib Bourguiba, Ariana",
    coordinates: [36.8665, 10.1985],
    suppliers: ['monoprix']
  },
  {
    id: 47,
    name: "Monoprix Beja",
    address: "Avenue Habib Bourguiba, Beja",
    coordinates: [36.7255, 9.1835],
    suppliers: ['monoprix']
  },
  {
    id: 48,
    name: "Monoprix Kairouan",
    address: "Avenue Mongi Slim, Kairouan",
    coordinates: [35.6785, 9.8765],
    suppliers: ['monoprix']
  },
  {
    id: 49,
    name: "Monoprix Tozeur",
    address: "Avenue Habib Bourguiba, Tozeur",
    coordinates: [33.9020, 8.1295],
    suppliers: ['monoprix']
  },
  {
    id: 50,
    name: "Monoprix Tataouine",
    address: "Avenue Farhat Hached, Tataouine",
    coordinates: [32.9310, 10.4995],
    suppliers: ['monoprix']
  },
  {
    id: 51,
    name: "Ben Yaghlen Gabès",
    address: "15 Avenue Habib Bourguiba, Gabès",
    coordinates: [33.8810, 10.0983],
    suppliers: ['benyaghlen']
  },
  {
    id: 52,
    name: "Ben Yaghlen Sfax",
    address: "21 Avenue Mohamed Ali, Sfax",
    coordinates: [34.7400, 10.7600],
    suppliers: ['benyaghlen']
  },
  {
    id: 53,
    name: "Ben Yaghlen Sousse",
    address: "12 Avenue Habib Bourguiba, Sousse",
    coordinates: [35.8250, 10.6361],
    suppliers: ['benyaghlen']
  },
  {
    id: 54,
    name: "Ben Yaghlen Mahdia",
    address: "23 Rue Ibn Khaldoun, Mahdia",
    coordinates: [35.5046, 11.0624],
    suppliers: ['benyaghlen']
  },
  {
    id: 55,
    name: "Ben Yaghlen Monastir",
    address: "7 Rue de la République, Monastir",
    coordinates: [35.7592, 10.7769],
    suppliers: ['benyaghlen']
  },

  // Carrefour locations - Extended
  {
    id: 56,
    name: "Carrefour Gabes",
    address: "Centre Commercial Gabes Mall, Gabes",
    coordinates: [33.8805, 10.0987],
    suppliers: ['carrefour']
  },
  {
    id: 57,
    name: "Carrefour Sfax",
    address: "Centre Commercial Sfax City, Sfax",
    coordinates: [34.7405, 10.7605],
    suppliers: ['carrefour']
  },
  {
    id: 58,
    name: "Carrefour Sousse",
    address: "Centre Commercial Sousse Plaza, Sousse",
    coordinates: [35.8255, 10.6365],
    suppliers: ['carrefour']
  },
  {
    id: 59,
    name: "Carrefour Mahdia",
    address: "Centre Commercial Mahdia Mall, Mahdia",
    coordinates: [35.5050, 11.0627],
    suppliers: ['carrefour']
  },
  {
    id: 60,
    name: "Carrefour Monastir",
    address: "Centre Commercial Monastir Plaza, Monastir",
    coordinates: [35.7595, 10.7770],
    suppliers: ['carrefour']
  },

  // Géant locations - Extended
  {
    id: 61,
    name: "Géant Gabes",
    address: "Route de Gabes, Gabes",
    coordinates: [33.8800, 10.0985],
    suppliers: ['geant']
  },
  {
    id: 62,
    name: "Géant Sfax",
    address: "Route de Sfax, Sfax",
    coordinates: [34.7402, 10.7602],
    suppliers: ['geant']
  },
  {
    id: 63,
    name: "Géant Sousse",
    address: "Route de Sousse, Sousse",
    coordinates: [35.8252, 10.6362],
    suppliers: ['geant']
  },
  {
    id: 64,
    name: "Géant Mahdia",
    address: "Route de Mahdia, Mahdia",
    coordinates: [35.5048, 11.0626],
    suppliers: ['geant']
  },
  {
    id: 65,
    name: "Géant Monastir",
    address: "Route de Monastir, Monastir",
    coordinates: [35.7597, 10.7772],
    suppliers: ['geant']
  },

  // Monoprix locations - Extended
  {
    id: 66,
    name: "Monoprix Gabes",
    address: "Avenue Habib Bourguiba, Gabes",
    coordinates: [33.8805, 10.0986],
    suppliers: ['monoprix']
  },
  {
    id: 67,
    name: "Monoprix Sfax",
    address: "Avenue Mohamed Ali, Sfax",
    coordinates: [34.7403, 10.7603],
    suppliers: ['monoprix']
  },
  {
    id: 68,
    name: "Monoprix Sousse",
    address: "Avenue Habib Bourguiba, Sousse",
    coordinates: [35.8253, 10.6363],
    suppliers: ['monoprix']
  },
  {
    id: 69,
    name: "Monoprix Mahdia",
    address: "Avenue Ibn Khaldoun, Mahdia",
    coordinates: [35.5052, 11.0628],
    suppliers: ['monoprix']
  },
  {
    id: 70,
    name: "Monoprix Monastir",
    address: "Avenue de la République, Monastir",
    coordinates: [35.7599, 10.7774],
    suppliers: ['monoprix']
  },
  
  // Les Saveurs de Carthage locations
  {
    id: 71,
    name: "Les Saveurs de Carthage - Centre",
    address: "15 Avenue Habib Bourguiba, Carthage",
    coordinates: [36.8605, 10.3245],
    suppliers: ['saveurs-carthage']
  },
  {
    id: 72,
    name: "Les Saveurs de Carthage - Port",
    address: "23 Rue de la Mer, Carthage",
    coordinates: [36.8623, 10.3267],
    suppliers: ['saveurs-carthage']
  },
  {
    id: 73,
    name: "Les Saveurs de Carthage - Byrsa",
    address: "8 Avenue Habib Bourguiba, Carthage Byrsa",
    coordinates: [36.8581, 10.3232],
    suppliers: ['saveurs-carthage']
  },
  
  // La Firma locations
  {
    id: 74,
    name: "La Firma - Centre Ville",
    address: "45 Avenue de la République, Hammamet",
    coordinates: [36.4015, 10.6167],
    suppliers: ['la-firma']
  },
  {
    id: 75,
    name: "La Firma - Zone Touristique",
    address: "12 Avenue des Jasmins, Hammamet",
    coordinates: [36.4058, 10.6134],
    suppliers: ['la-firma']
  },
  {
    id: 76,
    name: "La Firma - Yasmine Hammamet",
    address: "Marina Yasmine, Hammamet",
    coordinates: [36.3729, 10.5399],
    suppliers: ['la-firma']
  },
  
  // Mazraa Market locations
  {
    id: 77,
    name: "Mazraa Market - Lac 1",
    address: "25 Rue du Lac, Tunis",
    coordinates: [36.8317, 10.2395],
    suppliers: ['mazraa-market']
  },
  {
    id: 78,
    name: "Mazraa Market - Centre Urbain Nord",
    address: "17 Avenue Hédi Nouira, Tunis",
    coordinates: [36.8485, 10.1963],
    suppliers: ['mazraa-market']
  },
  {
    id: 79,
    name: "Mazraa Market - La Marsa",
    address: "32 Avenue Habib Bourguiba, La Marsa",
    coordinates: [36.8789, 10.3222],
    suppliers: ['mazraa-market']
  },
  
  // Anoir locations
  {
    id: 80,
    name: "Anoir - Hammamet Centre",
    address: "9 Rue Ali Belhouane, Hammamet",
    coordinates: [36.4023, 10.6097],
    suppliers: ['anoir']
  },
  {
    id: 81,
    name: "Anoir - Nabeul",
    address: "14 Avenue Habib Bourguiba, Nabeul",
    coordinates: [36.4568, 10.7399],
    suppliers: ['anoir']
  },
  {
    id: 82,
    name: "Anoir - Mrezga",
    address: "7 Rue de Carthage, Mrezga, Hammamet",
    coordinates: [36.4152, 10.6072],
    suppliers: ['anoir']
  },
  
  // Belgueyed Hassine locations
  {
    id: 83,
    name: "Belgueyed Hassine - Centre Ariana",
    address: "56 Avenue Habib Bourguiba, Ariana",
    coordinates: [36.8653, 10.1912],
    suppliers: ['belgueyed-hassine']
  },
  {
    id: 84,
    name: "Belgueyed Hassine - Borj Louzir",
    address: "23 Rue de Carthage, Borj Louzir, Ariana",
    coordinates: [36.8734, 10.1845],
    suppliers: ['belgueyed-hassine']
  },
  {
    id: 85,
    name: "Belgueyed Hassine - Menzah 6",
    address: "12 Avenue Hédi Nouira, Menzah 6, Ariana",
    coordinates: [36.8478, 10.1723],
    suppliers: ['belgueyed-hassine']
  },
  
  // Ayem Zmen locations
  {
    id: 86,
    name: "Ayem Zmen - La Marsa Plage",
    address: "27 Avenue de la Plage, La Marsa",
    coordinates: [36.8901, 10.3217],
    suppliers: ['ayem-zmen']
  },
  {
    id: 87,
    name: "Ayem Zmen - La Marsa Centre",
    address: "15 Avenue Habib Bourguiba, La Marsa",
    coordinates: [36.8786, 10.3195],
    suppliers: ['ayem-zmen']
  },
  {
    id: 88,
    name: "Ayem Zmen - Gammarth",
    address: "Zone Touristique, Gammarth, La Marsa",
    coordinates: [36.9120, 10.2937],
    suppliers: ['ayem-zmen']
  },

  // Additional Ben Yaghlen locations
  {
    id: 89,
    name: "Ben Yaghlen Gafsa",
    address: "78 Avenue de l'Environnement, Gafsa",
    coordinates: [34.4311, 8.7843],
    suppliers: ['benyaghlen']
  },
  {
    id: 90,
    name: "Ben Yaghlen El Kef",
    address: "45 Avenue de l'Indépendance, El Kef",
    coordinates: [36.1673, 8.7147],
    suppliers: ['benyaghlen']
  },
  {
    id: 91,
    name: "Ben Yaghlen Médenine",
    address: "23 Rue Ibn Khaldoun, Médenine",
    coordinates: [33.3399, 10.4957],
    suppliers: ['benyaghlen']
  },

  // Additional Carrefour locations
  {
    id: 92,
    name: "Carrefour Gafsa",
    address: "Centre Commercial Gafsa Mall",
    coordinates: [34.4315, 8.7847],
    suppliers: ['carrefour']
  },
  {
    id: 93,
    name: "Carrefour El Kef",
    address: "Centre Commercial El Kef City",
    coordinates: [36.1677, 8.7151],
    suppliers: ['carrefour']
  },
  {
    id: 94,
    name: "Carrefour Médenine",
    address: "Centre Commercial Médenine Plaza",
    coordinates: [33.3403, 10.4961],
    suppliers: ['carrefour']
  },

  // Additional Géant locations
  {
    id: 95,
    name: "Géant Gafsa",
    address: "Route de Tunis, Gafsa",
    coordinates: [34.4319, 8.7851],
    suppliers: ['geant']
  },
  {
    id: 96,
    name: "Géant El Kef",
    address: "Route de Tunis, El Kef",
    coordinates: [36.1681, 8.7155],
    suppliers: ['geant']
  },
  {
    id: 97,
    name: "Géant Médenine",
    address: "Route de Médenine",
    coordinates: [33.3407, 10.4965],
    suppliers: ['geant']
  },

  // Additional Monoprix locations
  {
    id: 98,
    name: "Monoprix Gafsa",
    address: "Avenue Habib Bourguiba, Gafsa",
    coordinates: [34.4323, 8.7855],
    suppliers: ['monoprix']
  },
  {
    id: 99,
    name: "Monoprix El Kef",
    address: "Avenue Habib Bourguiba, El Kef",
    coordinates: [36.1685, 8.7159],
    suppliers: ['monoprix']
  },
  {
    id: 100,
    name: "Monoprix Médenine",
    address: "Avenue Habib Bourguiba, Médenine",
    coordinates: [33.3411, 10.4969],
    suppliers: ['monoprix']
  },

  // Additional Ben Yaghlen locations
  {
    id: 101,
    name: "Ben Yaghlen Carthage",
    address: "23 Avenue Hannibal, Carthage",
    coordinates: [36.8625, 10.3272],
    suppliers: ['benyaghlen']
  },
  {
    id: 102,
    name: "Ben Yaghlen Sidi Bou Said",
    address: "16 Rue des Habous, Sidi Bou Said",
    coordinates: [36.8707, 10.3413],
    suppliers: ['benyaghlen']
  },
  {
    id: 103,
    name: "Ben Yaghlen Kelibia",
    address: "78 Avenue de la République, Kelibia",
    coordinates: [36.8471, 11.0988],
    suppliers: ['benyaghlen']
  },
  {
    id: 104,
    name: "Ben Yaghlen Djerba Midoun",
    address: "45 Avenue Habib Bourguiba, Midoun",
    coordinates: [33.8079, 10.9844],
    suppliers: ['benyaghlen']
  },
  {
    id: 105,
    name: "Ben Yaghlen Houmt Souk",
    address: "32 Avenue 14 Janvier, Houmt Souk",
    coordinates: [33.8755, 10.8570],
    suppliers: ['benyaghlen']
  },
  
  // Additional Carrefour locations
  {
    id: 106,
    name: "Carrefour Carthage",
    address: "Centre Commercial Carthage Mall",
    coordinates: [36.8630, 10.3265],
    suppliers: ['carrefour']
  },
  {
    id: 107,
    name: "Carrefour Kelibia",
    address: "Centre Commercial Kelibia Plaza",
    coordinates: [36.8475, 11.0992],
    suppliers: ['carrefour']
  },
  {
    id: 108,
    name: "Carrefour Djerba",
    address: "Centre Commercial Midoun Mall, Djerba",
    coordinates: [33.8082, 10.9848],
    suppliers: ['carrefour']
  },
  {
    id: 109,
    name: "Carrefour Houmt Souk",
    address: "Centre Commercial Djerba Mall, Houmt Souk",
    coordinates: [33.8760, 10.8575],
    suppliers: ['carrefour']
  },
  {
    id: 110,
    name: "Carrefour Gammarth",
    address: "Zone Touristique, Gammarth",
    coordinates: [36.9115, 10.2930],
    suppliers: ['carrefour']
  },
  
  // Additional Géant locations
  {
    id: 111,
    name: "Géant Carthage",
    address: "Route de Carthage, Carthage",
    coordinates: [36.8632, 10.3268],
    suppliers: ['geant']
  },
  {
    id: 112,
    name: "Géant Kelibia",
    address: "Route de Tunis, Kelibia",
    coordinates: [36.8478, 11.0995],
    suppliers: ['geant']
  },
  {
    id: 113,
    name: "Géant Djerba",
    address: "Zone Touristique Midoun, Djerba",
    coordinates: [33.8085, 10.9850],
    suppliers: ['geant']
  },
  {
    id: 114,
    name: "Géant Houmt Souk",
    address: "Route de l'Aéroport, Houmt Souk",
    coordinates: [33.8763, 10.8578],
    suppliers: ['geant']
  },
  {
    id: 115,
    name: "Géant Gammarth",
    address: "Zone Touristique, Gammarth",
    coordinates: [36.9118, 10.2935],
    suppliers: ['geant']
  },
  
  // Additional Monoprix locations
  {
    id: 116,
    name: "Monoprix Carthage",
    address: "Avenue Hannibal, Carthage",
    coordinates: [36.8635, 10.3270],
    suppliers: ['monoprix']
  },
  {
    id: 117,
    name: "Monoprix Sidi Bou Said",
    address: "Rue des Habous, Sidi Bou Said",
    coordinates: [36.8710, 10.3417],
    suppliers: ['monoprix']
  },
  {
    id: 118,
    name: "Monoprix Kelibia",
    address: "Avenue de la République, Kelibia",
    coordinates: [36.8480, 11.0998],
    suppliers: ['monoprix']
  },
  {
    id: 119,
    name: "Monoprix Djerba Midoun",
    address: "Avenue Habib Bourguiba, Midoun",
    coordinates: [33.8088, 10.9852],
    suppliers: ['monoprix']
  },
  {
    id: 120,
    name: "Monoprix Houmt Souk",
    address: "Avenue 14 Janvier, Houmt Souk",
    coordinates: [33.8767, 10.8582],
    suppliers: ['monoprix']
  },
  
  // Additional specialized stores locations
  {
    id: 121,
    name: "Les Saveurs de Carthage - Sidi Bou Said",
    address: "22 Rue des Jasmin, Sidi Bou Said",
    coordinates: [36.8712, 10.3420],
    suppliers: ['saveurs-carthage']
  },
  {
    id: 122,
    name: "Les Saveurs de Carthage - Gammarth",
    address: "Zone Touristique, Gammarth",
    coordinates: [36.9122, 10.2940],
    suppliers: ['saveurs-carthage']
  },
  {
    id: 123,
    name: "La Firma - Nabeul",
    address: "56 Avenue Habib Bourguiba, Nabeul",
    coordinates: [36.4570, 10.7402],
    suppliers: ['la-firma']
  },
  {
    id: 124,
    name: "La Firma - Tunis",
    address: "78 Avenue de la Liberté, Tunis",
    coordinates: [36.8070, 10.1820],
    suppliers: ['la-firma']
  },
  {
    id: 125,
    name: "Mazraa Market - Gammarth",
    address: "Zone Touristique, Gammarth",
    coordinates: [36.9125, 10.2943],
    suppliers: ['mazraa-market']
  },
  {
    id: 126,
    name: "Mazraa Market - Carthage",
    address: "34 Avenue Hannibal, Carthage",
    coordinates: [36.8638, 10.3273],
    suppliers: ['mazraa-market']
  },
  {
    id: 127,
    name: "Anoir - Djerba",
    address: "Zone Touristique, Djerba",
    coordinates: [33.8091, 10.9855],
    suppliers: ['anoir']
  },
  {
    id: 128,
    name: "Anoir - Tunis",
    address: "67 Avenue Habib Bourguiba, Tunis",
    coordinates: [36.8075, 10.1825],
    suppliers: ['anoir']
  },
  {
    id: 129,
    name: "Belgueyed Hassine - Carthage",
    address: "45 Avenue Hannibal, Carthage",
    coordinates: [36.8640, 10.3275],
    suppliers: ['belgueyed-hassine']
  },
  {
    id: 130,
    name: "Belgueyed Hassine - Sidi Bou Said",
    address: "33 Rue des Habous, Sidi Bou Said",
    coordinates: [36.8715, 10.3425],
    suppliers: ['belgueyed-hassine']
  },
  {
    id: 131,
    name: "Ayem Zmen - Carthage",
    address: "56 Avenue Hannibal, Carthage",
    coordinates: [36.8642, 10.3277],
    suppliers: ['ayem-zmen']
  },
  {
    id: 132,
    name: "Ayem Zmen - Sidi Bou Said",
    address: "29 Rue des Habous, Sidi Bou Said",
    coordinates: [36.8718, 10.3428],
    suppliers: ['ayem-zmen']
  }
];
