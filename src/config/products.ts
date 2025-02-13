export interface ProductConfig {
  id: string;
  name: string;
  description: string;
  startingPrice: string;
  image?: string;
  presentationImage?: string;
}

export const products: ProductConfig[] = [
  {
    id: "tshirt",
    name: "T-shirt Classique",
    description: "T-shirt classique, parfait pour toute occasion. Design unique et qualité premium garantie.",
    startingPrice: "25.00",
    image: "/ProductImages/BlackTshirt.png",
    presentationImage: "/ProductImages/BlackTshirtArriere.png"
  },
  {
    id: "buttons-tshirt",
    name: "T-shirt à Boutons",
    description: "T-shirt avec boutons décoratifs. Style unique et moderne.",
    startingPrice: "35.00",
    image: "/ProductImages/BlackButtonsTshirt.png",
    presentationImage: "/ProductImages/BlackButtonsTshirtArriere.png"
  },
  {
    id: "long-sleeves",
    name: "T-shirt Manches Longues",
    description: "T-shirt à manches longues confortable et élégant.",
    startingPrice: "40.00",
    image: "/ProductImages/RedLongSleavesShirt.png",
    presentationImage: "/ProductImages/RedLongSleavesShirtBack.png"
  },
  {
    id: "marketing-flag",
    name: "Drapeau Publicitaire",
    description: "Drapeau publicitaire pour une visibilité maximale.",
    startingPrice: "45.00",
    image: "/ProductImages/RedMarketingFlag.png",
    presentationImage: "/ProductImages/RedMarketingFlag.png"
  },
  {
    id: "tablier",
    name: "Tablier Professionnel",
    description: "Tablier professionnel. Idéal pour la cuisine ou le service.",
    startingPrice: "30.00",
    image: "/ProductImages/BlackTablier.png",
    presentationImage: "/ProductImages/BlackTablier.png"
  },
  {
    id: "mug",
    name: "Mug Personnalisé",
    description: "Mug élégant pour votre café quotidien.",
    startingPrice: "15.00",
    image: "/ProductImages/BlackMug.png",
    presentationImage: "/ProductImages/BlackMug.png"
  },
  {
    id: "notebook",
    name: "Carnet Personnalisé",
    description: "Carnet élégant pour vos notes quotidiennes.",
    startingPrice: "20.00",
    image: "/ProductImages/WhiteNotebook.png",
    presentationImage: "/ProductImages/WhiteNotebook.png"
  },
  {
    id: "bag",
    name: "Sac Personnalisé",
    description: "Sac pratique et stylé pour tous les jours.",
    startingPrice: "25.00",
    image: "/ProductImages/YellowSac.png",
    presentationImage: "/ProductImages/YellowSac.png"
  }
];