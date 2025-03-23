
export interface SubItem {
  title: string;
  description: string;
  path: string;
  image: string;
}

export interface MenuItem {
  topText: string;
  bottomText: string;
  path: string;
  subItems?: SubItem[];
}

export const menuItems: MenuItem[] = [
  {
    topText: "Accueil",
    bottomText: "Notre entreprise",
    path: "/",
    subItems: []
  },
  {
    topText: "Produits",
    bottomText: "Découvrez notre gamme",
    path: "/products",
    subItems: [
      {
        title: "Dattes Fraîches",
        description: "Nos délicieuses dattes Deglet Nour fraîches et naturelles",
        path: "/products/dattes-fraiches",
        image: "/produits/dattes-fraiches.jpg"
      },
      {
        title: "Dérivés de Dattes",
        description: "Des produits transformés à base de dattes de qualité supérieure",
        path: "/products/produits-derives",
        image: "/produits/derives-dattes.jpg"
      },
      {
        title: "Figues Séchées",
        description: "Nos figues séchées selon la tradition tunisienne",
        path: "/products/figues-sechees",
        image: "/produits/figues-sechees.jpg"
      }
    ]
  },
  {
    topText: "À Propos",
    bottomText: "Notre histoire",
    path: "/about",
    subItems: []
  },
  {
    topText: "Nos Partenaires",
    bottomText: "Ils nous font confiance",
    path: "/partners",
    subItems: []
  },
  {
    topText: "Qualité",
    bottomText: "Nos certifications",
    path: "/certifications",
    subItems: []
  },
  {
    topText: "Contact",
    bottomText: "Service client",
    path: "/contact",
    subItems: []
  }
];
