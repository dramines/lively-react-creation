interface CategoryContent {
  title: string;
  description: string;
  bannerImage: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  }>;
}

export const categoriesContent: Record<string, Record<string, CategoryContent>> = {
  'vetements-cuisine': {
    'vestes': {
      title: 'Vestes de Chef',
      description: 'Collection premium pour cuisiniers professionnels',
      bannerImage: '/VetementDeCuisine/vestedecuisineImagebanner.jpg',
      features: [
        {
          title: 'Confort Premium',
          description: 'Tissus respirants et légers pour un confort optimal'
        },
        {
          title: 'Durabilité',
          description: 'Matériaux robustes pour une utilisation intensive'
        },
        {
          title: 'Style Professionnel',
          description: 'Design élégant adapté au milieu de la restauration'
        }
      ],
      products: [
        {
          id: 1,
          name: 'Veste Chef Premium',
          description: 'Veste professionnelle haut de gamme',
          price: 79.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        }
      ]
    },
    'tabliers': {
      title: 'Tabliers de Cuisine',
      description: 'Protection et style pour votre cuisine',
      bannerImage: '/VetementDeCuisine/vestedecuisineImagebanner.jpg',
      features: [
        {
          title: 'Protection Optimale',
          description: 'Protection complète contre les éclaboussures'
        },
        {
          title: 'Praticité',
          description: 'Poches multiples pour vos ustensiles'
        },
        {
          title: 'Confort',
          description: 'Léger et ajustable pour plus de confort'
        }
      ],
      products: [
        {
          id: 1,
          name: 'Tablier Pro Chef',
          description: 'Tablier professionnel premium',
          price: 39.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        }
      ]
    }
  },
  'vetements-boucher': {
    'vestes': {
      title: 'Vestes de Boucher Pro',
      description: 'Confort et hygiène pour les professionnels de la boucherie',
      bannerImage: '/VetementDeCuisine/vestedecuisineImagebanner.jpg',
      features: [
        {
          title: 'Tissu Respirant',
          description: 'Matériaux de haute qualité pour un confort optimal'
        },
        {
          title: 'Résistance Supérieure',
          description: 'Conçu pour résister aux conditions exigeantes'
        },
        {
          title: 'Design Professionnel',
          description: 'Style élégant et fonctionnel'
        }
      ],
      products: [
        {
          id: 1,
          name: 'Veste Pro Boucher',
          description: 'Veste professionnelle premium',
          price: 69.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        }
      ]
    },
    'tabliers': {
      title: 'Tabliers de Boucher',
      description: 'Protection renforcée pour les professionnels',
      bannerImage: '/VetementDeCuisine/vestedecuisineImagebanner.jpg',
      features: [
        {
          title: 'Protection Maximale',
          description: 'Protection renforcée contre les coupures'
        },
        {
          title: 'Hygiène',
          description: 'Matériaux faciles à nettoyer'
        },
        {
          title: 'Durabilité',
          description: 'Conçu pour un usage intensif'
        }
      ],
      products: [
        {
          id: 1,
          name: 'Tablier Pro Boucher',
          description: 'Protection optimale pour les professionnels',
          price: 49.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        }
      ]
    }
  },
  'vetements-medicaux': {
    'blouses': {
      title: 'Blouses Médicales',
      description: 'Blouses professionnelles pour le personnel médical',
      bannerImage: '/VetementDeCuisine/vestedecuisineImagebanner.jpg',
      features: [
        {
          title: 'Hygiène Maximale',
          description: 'Tissus antibactériens et faciles à entretenir'
        },
        {
          title: 'Confort au Quotidien',
          description: 'Coupe ergonomique pour une liberté de mouvement optimale'
        },
        {
          title: 'Durabilité',
          description: 'Matériaux résistants aux lavages fréquents'
        }
      ],
      products: [
        {
          id: 1,
          name: 'Blouse Médicale Classic',
          description: 'Blouse professionnelle standard',
          price: 59.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        },
        {
          id: 2,
          name: 'Blouse Médicale Premium',
          description: 'Blouse professionnelle haute qualité',
          price: 79.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        }
      ]
    }
  },
  'vetements-esthetique': {
    'accessoires': {
      title: 'Accessoires Esthétique',
      description: 'Accessoires professionnels pour esthéticiennes',
      bannerImage: '/VetementDeCuisine/vestedecuisineImagebanner.jpg',
      features: [
        {
          title: 'Qualité Premium',
          description: 'Matériaux haut de gamme pour un usage professionnel'
        },
        {
          title: 'Design Ergonomique',
          description: 'Conçu pour un confort optimal durant les soins'
        },
        {
          title: 'Style Professionnel',
          description: 'Élégance et praticité pour votre institut'
        }
      ],
      products: [
        {
          id: 1,
          name: 'Kit Accessoires Essential',
          description: 'Kit complet pour professionnels',
          price: 89.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        },
        {
          id: 2,
          name: 'Pack Accessoires Premium',
          description: 'Ensemble d\'accessoires haut de gamme',
          price: 129.99,
          image: '/VetementDeCuisine/vestedecuisineImagebanner.jpg'
        }
      ]
    }
  }
};
