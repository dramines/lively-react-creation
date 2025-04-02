
// Configuration file for partners/clients that have trusted the company

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
}

export const partners: Partner[] = [
  {
    id: 'carrefour',
    name: 'Carrefour',
    logo: 'Carrefour-Tunisie.png',
    description: 'Hypermarché international présent dans toute la Tunisie',
    website: 'https://www.carrefour.tn/'
  },
  {
    id: 'geant',
    name: 'Géant',
    logo: 'geant.jpg',
    description: 'Grande surface offrant une large gamme de produits alimentaires',
    website: 'https://www.geant.tn/'
  },
  {
    id: 'monoprix',
    name: 'Monoprix',
    logo: 'monoprix.png',
    description: 'Supermarché premium avec des produits de qualité',
    website: 'https://www.monoprix.tn/'
  },
  {
    id: 'badira',
    name: 'Badira',
    logo: 'https://www.labadira.com/wp-content/themes/badira/images/logoFooter.png',
    description: 'Chaîne de magasins proposant des produits alimentaires traditionnels tunisiens',
    website: 'https://www.labadira.com/'
  },
  {
    id: 'sigale',
    name: 'Sigale',
    logo: 'https://cdn2.tqsan.com/lacigale/wp-content/uploads/2024/10/lLOGO-GOLF-650x650.png',
    description: 'Distributeur spécialisé en produits d\'épicerie fine et produits locaux',
    website: 'https://www.lacigaletabarka.com/'
  },
  {
    id: 'tpcom',
    name: 'TP.com',
    logo: 'https://www.tp.com/media/vzwfxxfo/vector.svg',
    description: 'Distributeur international de produits alimentaires de qualité',
    website: 'https://www.tp.com/en-us/'
  }
];
