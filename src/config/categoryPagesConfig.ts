interface Feature {
  title: string;
  description: string;
}

export interface CategoryPageConfig {
  title: string;
  description: string;
  bannerImage: string;
  features: Feature[];
  categoryType: string;
  parentCategory?: string;
}

export const categoryPagesConfig: Record<string, CategoryPageConfig> = {
  // Main categories
  "vetements-cuisine": {
    title: "Vêtements de Cuisine",
    description: "Des vêtements professionnels pour tous les métiers de la cuisine",
    bannerImage: "/VetementDeCuisine/vestedecuisineImagebanner.jpg",
    features: [
      {
        title: "Qualité Premium",
        description: "Matériaux durables et confortables pour un usage professionnel intensif"
      },
      {
        title: "Personnalisation",
        description: "Service de personnalisation disponible pour tous nos produits"
      },
      {
        title: "Livraison Rapide",
        description: "Expédition sous 24/48h pour toute la France métropolitaine"
      }
    ],
    categoryType: "vetements-cuisine"
  },
  "vetements-boulanger": {
    title: "Vêtements Boulanger & Pâtissier",
    description: "Tenues professionnelles pour boulangers et pâtissiers",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Confort Optimal",
        description: "Tissus respirants adaptés aux environnements chauds"
      },
      {
        title: "Hygiène Garantie",
        description: "Matériaux faciles à nettoyer et conformes aux normes HACCP"
      },
      {
        title: "Sur-Mesure",
        description: "Possibilité d'ajustements selon vos besoins"
      }
    ],
    categoryType: "vetements-boulanger"
  },
  "vetements-hotellerie": {
    title: "Vêtements Service & Hôtellerie",
    description: "Tenues élégantes pour le service et l'hôtellerie",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Élégance",
        description: "Design professionnel et moderne"
      },
      {
        title: "Confort",
        description: "Matériaux légers et agréables à porter"
      },
      {
        title: "Durabilité",
        description: "Résistance aux lavages fréquents"
      }
    ],
    categoryType: "vetements-hotellerie"
  },
  "vetements-travail": {
    title: "Vêtements de Travail",
    description: "Vêtements professionnels adaptés à tous les métiers",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Protection",
        description: "Conformes aux normes de sécurité"
      },
      {
        title: "Résistance",
        description: "Matériaux renforcés pour une durée de vie maximale"
      },
      {
        title: "Praticité",
        description: "Poches et rangements fonctionnels"
      }
    ],
    categoryType: "vetements-travail"
  },
  "chaussures": {
    title: "Chaussures de Sécurité",
    description: "Chaussures professionnelles pour votre sécurité",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Sécurité",
        description: "Protection optimale des pieds"
      },
      {
        title: "Confort",
        description: "Semelles ergonomiques pour un port prolongé"
      },
      {
        title: "Durabilité",
        description: "Matériaux résistants à l'usure"
      }
    ],
    categoryType: "chaussures"
  },
  "produits-marketing": {
    title: "Produits Marketing",
    description: "Solutions marketing personnalisées pour votre entreprise",
    bannerImage: "/ProduitsMarketing/ProduitMarketingBanner.jpg",
    features: [
      {
        title: "Personnalisation",
        description: "Options de personnalisation étendues"
      },
      {
        title: "Qualité",
        description: "Matériaux premium pour une finition parfaite"
      },
      {
        title: "Service",
        description: "Accompagnement personnalisé pour vos projets"
      }
    ],
    categoryType: "produits-marketing"
  },

  // Subcategories for Vêtements de Travail
  "vetements-travail/blouses": {
    title: "Blouses Médicales & Professionnelles",
    description: "Blouses médicales et professionnelles confortables et élégantes",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Confort Optimal",
        description: "Tissus légers et respirants pour un confort toute la journée"
      },
      {
        title: "Praticité",
        description: "Poches multiples et design ergonomique"
      },
      {
        title: "Entretien Facile",
        description: "Tissus faciles à nettoyer et résistants aux lavages fréquents"
      }
    ],
    categoryType: "vetements-travail",
    parentCategory: "Vêtements de Travail"
  },
  "vetements-travail/tuniques": {
    title: "Tuniques Médicales",
    description: "Tuniques professionnelles pour le personnel médical",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Design Moderne",
        description: "Coupe moderne et professionnelle"
      },
      {
        title: "Confort",
        description: "Matériaux premium pour un confort optimal"
      },
      {
        title: "Durabilité",
        description: "Résistance aux lavages intensifs"
      }
    ],
    categoryType: "vetements-travail",
    parentCategory: "Vêtements de Travail"
  },
  "vetements-travail/combinaisons": {
    title: "Combinaisons de Travail",
    description: "Combinaisons professionnelles robustes et pratiques",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Protection Intégrale",
        description: "Protection complète pour tous types de travaux"
      },
      {
        title: "Résistance",
        description: "Matériaux renforcés pour une durabilité maximale"
      },
      {
        title: "Fonctionnalité",
        description: "Multiples poches et accès pratiques"
      }
    ],
    categoryType: "vetements-travail",
    parentCategory: "Vêtements de Travail"
  },

  // Subcategories for Vêtements Cuisine
  "vetements-cuisine/vestes": {
    title: "Vestes de Chef",
    description: "Vestes professionnelles pour chefs et cuisiniers",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Style Professionnel",
        description: "Design élégant et professionnel"
      },
      {
        title: "Confort Thermique",
        description: "Tissu respirant adapté aux environnements chauds"
      },
      {
        title: "Durabilité",
        description: "Résistance aux taches et lavages fréquents"
      }
    ],
    categoryType: "vetements-cuisine",
    parentCategory: "Vêtements de Cuisine"
  },
  "vetements-cuisine/tabliers": {
    title: "Tabliers de Cuisine",
    description: "Tabliers professionnels pour la cuisine",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Protection Optimale",
        description: "Protection contre les éclaboussures et taches"
      },
      {
        title: "Praticité",
        description: "Poches et attaches ajustables"
      },
      {
        title: "Résistance",
        description: "Matériaux résistants à l'usure quotidienne"
      }
    ],
    categoryType: "vetements-cuisine",
    parentCategory: "Vêtements de Cuisine"
  },
  "vetements-cuisine/pantalons": {
    title: "Pantalons de Cuisine",
    description: "Pantalons professionnels adaptés à la cuisine",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Confort Optimal",
        description: "Coupe ergonomique pour une liberté de mouvement"
      },
      {
        title: "Matériaux Durables",
        description: "Tissus résistants aux taches et à l'usure"
      },
      {
        title: "Entretien Facile",
        description: "Lavage industriel compatible"
      }
    ],
    categoryType: "vetements-cuisine",
    parentCategory: "Vêtements de Cuisine"
  },

  // Subcategories for Vêtements Boulanger & Pâtissier
  "vetements-boulanger/vestes": {
    title: "Vestes de Boulanger",
    description: "Vestes professionnelles pour boulangers et pâtissiers",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Confort Thermique",
        description: "Adaptées aux environnements chauds"
      },
      {
        title: "Hygiène",
        description: "Conformes aux normes d'hygiène"
      },
      {
        title: "Durabilité",
        description: "Résistance à l'usage intensif"
      }
    ],
    categoryType: "vetements-boulanger",
    parentCategory: "Vêtements Boulanger & Pâtissier"
  },
  "vetements-boulanger/tabliers": {
    title: "Tabliers Pro",
    description: "Tabliers professionnels pour la boulangerie et pâtisserie",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Protection",
        description: "Protection optimale contre la farine"
      },
      {
        title: "Confort",
        description: "Légèreté et respirabilité"
      },
      {
        title: "Praticité",
        description: "Poches pratiques et fonctionnelles"
      }
    ],
    categoryType: "vetements-boulanger",
    parentCategory: "Vêtements Boulanger & Pâtissier"
  },
  "vetements-boulanger/tabliers-boucher": {
    title: "Tabliers de Boucher",
    description: "Protection renforcée pour la boucherie",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Protection Renforcée",
        description: "Protection maximale pour la découpe"
      },
      {
        title: "Hygiène",
        description: "Facile à nettoyer et désinfecter"
      },
      {
        title: "Résistance",
        description: "Matériaux haute qualité"
      }
    ],
    categoryType: "vetements-boulanger",
    parentCategory: "Vêtements Boulanger & Pâtissier"
  },
  "vetements-boulanger/accessoires": {
    title: "Accessoires",
    description: "Accessoires essentiels pour boulangers et pâtissiers",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Praticité",
        description: "Accessoires ergonomiques"
      },
      {
        title: "Qualité",
        description: "Matériaux professionnels"
      },
      {
        title: "Hygiène",
        description: "Faciles à nettoyer"
      }
    ],
    categoryType: "vetements-boulanger",
    parentCategory: "Vêtements Boulanger & Pâtissier"
  },

  // Subcategories for Vêtements Service & Hôtellerie
  "vetements-hotellerie/service": {
    title: "Uniformes de Service",
    description: "Élégance et confort pour le service en restauration",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Élégance",
        description: "Style professionnel et raffiné"
      },
      {
        title: "Confort",
        description: "Adaptés au service en mouvement"
      },
      {
        title: "Durabilité",
        description: "Résistance à l'usage quotidien"
      }
    ],
    categoryType: "vetements-hotellerie",
    parentCategory: "Vêtements Service & Hôtellerie"
  },
  "vetements-hotellerie/accueil": {
    title: "Tenues d'Accueil",
    description: "Tenues professionnelles pour l'accueil",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Image Professionnelle",
        description: "Style élégant et accueillant"
      },
      {
        title: "Confort",
        description: "Pour un port prolongé"
      },
      {
        title: "Entretien",
        description: "Facile à entretenir"
      }
    ],
    categoryType: "vetements-hotellerie",
    parentCategory: "Vêtements Service & Hôtellerie"
  },
  "vetements-hotellerie/accessoires": {
    title: "Accessoires Hôteliers",
    description: "Accessoires professionnels pour l'hôtellerie",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Fonctionnalité",
        description: "Accessoires pratiques"
      },
      {
        title: "Style",
        description: "Design professionnel"
      },
      {
        title: "Qualité",
        description: "Matériaux durables"
      }
    ],
    categoryType: "vetements-hotellerie",
    parentCategory: "Vêtements Service & Hôtellerie"
  },

  // Subcategories for Chaussures de sécurité
  "chaussures/cuisine": {
    title: "Chaussures Cuisine",
    description: "Chaussures adaptées aux professionnels de la cuisine",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Sécurité",
        description: "Antidérapantes et protectrices"
      },
      {
        title: "Confort",
        description: "Pour un usage prolongé"
      },
      {
        title: "Hygiène",
        description: "Faciles à nettoyer"
      }
    ],
    categoryType: "chaussures",
    parentCategory: "Chaussures de sécurité"
  },
  "chaussures/industrie": {
    title: "Chaussures Industrie",
    description: "Chaussures de sécurité pour l'industrie",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Protection",
        description: "Embout et semelle de protection"
      },
      {
        title: "Résistance",
        description: "Matériaux renforcés"
      },
      {
        title: "Confort",
        description: "Ergonomie optimisée"
      }
    ],
    categoryType: "chaussures",
    parentCategory: "Chaussures de sécurité"
  },
  "chaussures/accessoires": {
    title: "Accessoires Chaussures",
    description: "Accessoires pour chaussures de sécurité",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Entretien",
        description: "Produits de nettoyage spécialisés"
      },
      {
        title: "Confort",
        description: "Semelles et supports"
      },
      {
        title: "Protection",
        description: "Accessoires de protection supplémentaire"
      }
    ],
    categoryType: "chaussures",
    parentCategory: "Chaussures de sécurité"
  },

  // Subcategories for Produits Marketing
  "produits-marketing/drapeaux": {
    title: "Drapeaux",
    description: "Drapeaux publicitaires personnalisables pour votre marque",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Personnalisation",
        description: "Design sur mesure selon vos besoins"
      },
      {
        title: "Qualité",
        description: "Matériaux durables et résistants"
      },
      {
        title: "Visibilité",
        description: "Maximisez votre impact visuel"
      }
    ],
    categoryType: "produits-marketing",
    parentCategory: "Produits Marketing"
  },
  "produits-marketing/tshirts": {
    title: "T-shirts",
    description: "T-shirts personnalisés pour votre équipe et vos événements",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Confort",
        description: "Tissus de qualité supérieure"
      },
      {
        title: "Personnalisation",
        description: "Impression haute qualité de vos designs"
      },
      {
        title: "Polyvalence",
        description: "Multiples styles et coloris disponibles"
      }
    ],
    categoryType: "produits-marketing",
    parentCategory: "Produits Marketing"
  },
  "produits-marketing/mugs": {
    title: "Mugs",
    description: "Mugs personnalisés pour votre communication quotidienne",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Durabilité",
        description: "Matériaux résistants au lave-vaisselle"
      },
      {
        title: "Personnalisation",
        description: "Impression résistante et durable"
      },
      {
        title: "Impact",
        description: "Visibilité quotidienne de votre marque"
      }
    ],
    categoryType: "produits-marketing",
    parentCategory: "Produits Marketing"
  },
  "produits-marketing/carnets": {
    title: "Carnets",
    description: "Carnets et bloc-notes personnalisés pour votre communication",
    bannerImage: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
    features: [
      {
        title: "Élégance",
        description: "Finitions professionnelles"
      },
      {
        title: "Praticité",
        description: "Formats adaptés à vos besoins"
      },
      {
        title: "Personnalisation",
        description: "Marquage discret ou impactant"
      }
    ],
    categoryType: "produits-marketing",
    parentCategory: "Produits Marketing"
  }
};
