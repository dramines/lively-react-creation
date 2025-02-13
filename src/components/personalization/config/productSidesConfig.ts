
export interface ProductSide {
  id: string;
  title: string;
  description?: string;
}

export interface ProductSidesConfig {
  id: string;
  sides: ProductSide[];
}

export const productSidesConfigs: ProductSidesConfig[] = [
  {
    id: "tshirt",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt"
      }
    ]
  },
  {
    id: "buttons-tshirt",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt"
      }
    ]
  },
  {
    id: "long-sleeves",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt manches longues"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt manches longues"
      }
    ]
  },
  {
    id: "marketing-flag",
    sides: [
      {
        id: "front",
        title: "Face Principale",
        description: "Zone de personnalisation principale du drapeau"
      }
    ]
  },
  {
    id: "tablier",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre tablier"
      }
    ]
  },
  {
    id: "mug",
    sides: [
      {
        id: "front",
        title: "Face Principale",
        description: "Zone de personnalisation principale"
      }
    ]
  },
  {
    id: "notebook",
    sides: [
      {
        id: "front",
        title: "Couverture",
        description: "Personnalisez la couverture de votre carnet"
      }
    ]
  },
  {
    id: "bag",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Face principale du sac"
      }
    ]
  }
];
