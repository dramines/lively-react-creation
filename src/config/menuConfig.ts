
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
