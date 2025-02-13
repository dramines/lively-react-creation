
export interface CategoryContent {
  id: string;
  title: string;
  headerTitle: string;
  description: string;
  bannerImage: string;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: {
      text: string;
      type: 'promo' | 'destockage' | 'new';
    };
    rating: {
      score: number;
      reviews: number;
    };
  }>;
}

export const categoriesContent: Record<string, CategoryContent> = {
  'vetements-cuisine': {
    id: 'vetements-cuisine',
    title: 'La qualité au service de votre métier',
    headerTitle: 'VÊTEMENTS CUISINE ET RESTAURATION',
    description: "Manelli, le magasin spécialiste des vêtements de cuisine, utilise des tissus de haute qualité. Ultra résistants, ils assurent une excellente durabilité. Pour les hommes et les femmes, les professionnels comme les particuliers, les chefs cuisiniers d'un petit ou d'un grand restaurant comme les apprentis, une large gamme d'uniformes spécialisés dans la cuisine est proposée.",
    bannerImage: '/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png',
    products: [
      {
        id: '1',
        name: 'Bodywarmer isolant Femme Regatta Pro-fessional STAGE II',
        description: 'Bodywarmer isolant pour femme, parfait pour la cuisine professionnelle',
        price: 24.28,
        originalPrice: 34.68,
        image: '/lovable-uploads/c7046d56-7f03-4b6d-b599-ad3148741218.png',
        badge: {
          text: 'DÉSTOCKAGE -30%',
          type: 'destockage'
        },
        rating: {
          score: 3.5,
          reviews: 2
        }
      },
      {
        id: '2',
        name: 'Gilet de service Femme Robur ANETH',
        description: 'Gilet de service élégant et pratique pour femme',
        price: 41.86,
        originalPrice: 59.80,
        image: '/lovable-uploads/c7046d56-7f03-4b6d-b599-ad3148741218.png',
        badge: {
          text: 'DÉSTOCKAGE -30%',
          type: 'destockage'
        },
        rating: {
          score: 5,
          reviews: 1
        }
      },
      {
        id: '3',
        name: 'Gilet micropolaire femme BALTIC WOMEN',
        description: 'Gilet micropolaire confortable et chaud',
        price: 10.49,
        originalPrice: 14.98,
        image: '/lovable-uploads/c7046d56-7f03-4b6d-b599-ad3148741218.png',
        badge: {
          text: 'PROMO -30%',
          type: 'promo'
        },
        rating: {
          score: 1,
          reviews: 2
        }
      }
    ]
  },
  'vetements-boucher': {
    id: 'vetements-boucher',
    title: "L'expertise professionnelle pour les bouchers",
    headerTitle: 'VÊTEMENTS DE BOUCHERIE',
    description: "Découvrez notre gamme complète de vêtements spécialisés pour les professionnels de la boucherie. Des tissus résistants aux taches et durables, conçus pour répondre aux exigences du métier.",
    bannerImage: '/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png',
    products: []
  }
};
