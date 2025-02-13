
export interface MenuItem {
  title: string;
  image: string;
  path: string;
  topText: string;
  bottomText: string;
  subItems: SubItem[];
}

export interface SubItem {
  title: string;
  description: string;
  image: string;
  path: string;
}

export const menuItems: MenuItem[] = [
  {
    title: "Vêtements de cuisine",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/vetements-cuisine",
    topText: "Vêtements",
    bottomText: "de cuisine",
    subItems: [
      {
        title: "Vestes de Chef",
        description: "Collection premium pour cuisiniers professionnels",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-cuisine/vestes"
      },
      {
        title: "Tabliers",
        description: "Protection et style pour votre cuisine",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-cuisine/tabliers"
      },
      {
        title: "Pantalons",
        description: "Confort et durabilité garantis",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-cuisine/pantalons"
      }
    ]
  },
  {
    title: "Vêtements Boulanger & Pâtissier",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/vetements-boulanger",
    topText: "Vêtements",
    bottomText: "Boulanger & Pâtissier",
    subItems: [
      {
        title: "Vestes de Boulanger",
        description: "Tenues adaptées à la boulangerie",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-boulanger/vestes"
      },
      {
        title: "Tabliers Pro",
        description: "Protection maximale pour pâtissiers",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-boulanger/tabliers"
      },
      {
        title: "Accessoires",
        description: "Compléments essentiels",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-boulanger/accessoires"
      }
    ]
  },
  {
    title: "Vêtements boucher",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/vetements-boucher",
    topText: "Vêtements",
    bottomText: "boucher",
    subItems: [
      {
        title: "Tabliers de Boucher",
        description: "Protection renforcée",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-boucher/tabliers"
      },
      {
        title: "Vestes Pro",
        description: "Confort et hygiène",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-boucher/vestes"
      },
      {
        title: "Accessoires",
        description: "Équipement spécialisé",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-boucher/accessoires"
      }
    ]
  },
  {
    title: "Vêtements Service & Hôtellerie",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/vetements-hotellerie",
    topText: "Vêtements",
    bottomText: "Service & Hôtellerie",
    subItems: [
      {
        title: "Uniformes de Service",
        description: "Élégance et confort pour le service",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-hotellerie/service"
      },
      {
        title: "Tenues d'Accueil",
        description: "Pour un accueil professionnel",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-hotellerie/accueil"
      },
      {
        title: "Accessoires Hôteliers",
        description: "Compléments indispensables",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-hotellerie/accessoires"
      }
    ]
  },
  {
    title: "Vêtements Médicaux",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/vetements-medicaux",
    topText: "Vêtements",
    bottomText: "Médicaux",
    subItems: [
      {
        title: "Blouses Médicales",
        description: "Pour les professionnels de santé",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-medicaux/blouses"
      },
      {
        title: "Tuniques",
        description: "Confort et praticité",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-medicaux/tuniques"
      },
      {
        title: "Accessoires Médicaux",
        description: "Équipements essentiels",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-medicaux/accessoires"
      }
    ]
  },
  {
    title: "Vêtements esthéticiennes",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/vetements-esthetique",
    topText: "Vêtements",
    bottomText: "esthéticiennes",
    subItems: [
      {
        title: "Tuniques Esthétique",
        description: "Pour les soins professionnels",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-esthetique/tuniques"
      },
      {
        title: "Pantalons",
        description: "Confort et élégance",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-esthetique/pantalons"
      },
      {
        title: "Accessoires Beauté",
        description: "Compléments indispensables",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-esthetique/accessoires"
      }
    ]
  },
  {
    title: "Vêtements de travail",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/vetements-travail",
    topText: "Vêtements",
    bottomText: "de travail",
    subItems: [
      {
        title: "Combinaisons",
        description: "Protection intégrale",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-travail/combinaisons"
      },
      {
        title: "Vestes de Travail",
        description: "Robustes et fonctionnelles",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-travail/vestes"
      },
      {
        title: "Équipements",
        description: "Accessoires de protection",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-travail/equipements"
      }
    ]
  },
  {
    title: "Chaussures de sécurité",
    image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
    path: "/chaussures",
    topText: "Chaussures",
    bottomText: "de sécurité",
    subItems: [
      {
        title: "Chaussures Cuisine",
        description: "Sécurité en cuisine",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/chaussures/cuisine"
      },
      {
        title: "Chaussures Industrie",
        description: "Protection renforcée",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/chaussures/industrie"
      },
      {
        title: "Accessoires",
        description: "Entretien et confort",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/chaussures/accessoires"
      }
    ]
  }
];
