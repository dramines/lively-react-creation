
export interface ProductFace {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  startingPrice: string;
  image: string;
  faces: ProductFace[];
}

export const products: Product[] = [
  {
    id: "black-tshirt",
    name: "T-shirt Noir",
    description: "T-shirt noir classique, parfait pour toute occasion. Design unique et qualité premium garantie.",
    startingPrice: "25.00",
    image: "/ProductImages/BlackTshirt.png",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt",
        imageUrl: "/ProductImages/BlackTshirt.png"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt",
        imageUrl: "/ProductImages/BlackTshirt.png"
      }
    ]
  },
  {
    id: "white-tshirt",
    name: "T-shirt Blanc",
    description: "T-shirt blanc élégant et minimaliste. Tissu de haute qualité pour un confort optimal.",
    startingPrice: "25.00",
    image: "/ProductImages/WhiteTshirt.png",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt",
        imageUrl: "/ProductImages/WhiteTshirt.png"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt",
        imageUrl: "/ProductImages/WhiteTshirt.png"
      }
    ]
  },
  {
    id: "black-buttons-tshirt",
    name: "T-shirt Noir à Boutons",
    description: "T-shirt noir avec boutons décoratifs. Style unique et moderne.",
    startingPrice: "35.00",
    image: "/ProductImages/BlackButtonsTshirt.png",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt",
        imageUrl: "/ProductImages/BlackButtonsTshirt.png"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt",
        imageUrl: "/ProductImages/BlackButtonsTshirt.png"
      }
    ]
  },
  {
    id: "black-tablier",
    name: "Tablier Noir",
    description: "Tablier noir professionnel. Idéal pour la cuisine ou le service.",
    startingPrice: "30.00",
    image: "/ProductImages/BlackTablier.png",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre tablier",
        imageUrl: "/ProductImages/BlackTablier.png"
      }
    ]
  },
  {
    id: "white-tablier",
    name: "Tablier Blanc",
    description: "Tablier blanc professionnel. Parfait pour un look élégant.",
    startingPrice: "30.00",
    image: "/ProductImages/WhiteTabllier.png",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre tablier",
        imageUrl: "/ProductImages/WhiteTabllier.png"
      }
    ]
  },
  {
    id: "black-mug",
    name: "Mug Noir",
    description: "Mug noir élégant pour votre café quotidien.",
    startingPrice: "15.00",
    image: "/ProductImages/BlackMug.png",
    faces: [
      {
        id: "front",
        title: "Face Principale",
        description: "Zone de personnalisation principale",
        imageUrl: "/ProductImages/BlackMug.png"
      }
    ]
  },
  {
    id: "white-mug",
    name: "Mug Blanc",
    description: "Mug blanc classique avec votre design personnalisé.",
    startingPrice: "15.00",
    image: "/ProductImages/WhiteMug.png",
    faces: [
      {
        id: "front",
        title: "Face Principale",
        description: "Zone de personnalisation principale",
        imageUrl: "/ProductImages/WhiteMug.png"
      }
    ]
  },
  {
    id: "white-notebook",
    name: "Carnet Blanc",
    description: "Carnet blanc élégant pour vos notes quotidiennes.",
    startingPrice: "20.00",
    image: "/ProductImages/WhiteNotebook.png",
    faces: [
      {
        id: "front",
        title: "Couverture",
        description: "Personnalisez la couverture de votre carnet",
        imageUrl: "/ProductImages/WhiteNotebook.png"
      }
    ]
  },
  {
    id: "yellow-bag",
    name: "Sac Jaune",
    description: "Sac jaune pratique et stylé pour tous les jours.",
    startingPrice: "25.00",
    image: "/ProductImages/YellowSac.png",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Face principale du sac",
        imageUrl: "/ProductImages/YellowSac.png"
      }
    ]
  }
];
