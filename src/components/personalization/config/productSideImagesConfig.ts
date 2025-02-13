
export interface ProductSideImage {
  sideId: string;
  imageUrl: string;
}

export interface ProductSideImages {
  productId: string;
  sides: ProductSideImage[];
}

export const productSideImages: ProductSideImages[] = [
  {
    productId: "tshirt",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/BlackTshirt.png"
      },
      {
        sideId: "back",
        imageUrl: "/ProductImages/BlackTshirtArriere.png"
      }
    ]
  },
  {
    productId: "buttons-tshirt",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/BlackButtonsTshirt.png"
      },
      {
        sideId: "back",
        imageUrl: "/ProductImages/BlackButtonsTshirtArriere.png"
      }
    ]
  },
  {
    productId: "long-sleeves",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/RedLongSleavesShirt.png"
      },
      {
        sideId: "back",
        imageUrl: "/ProductImages/RedLongSleavesShirtBack.png"
      }
    ]
  },
  {
    productId: "marketing-flag",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/RedMarketingFlag.png"
      }
    ]
  },
  {
    productId: "tablier",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/BlackTablier.png"
      }
    ]
  },
  {
    productId: "mug",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/BlackMug.png"
      }
    ]
  },
  {
    productId: "notebook",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/WhiteNotebook.png"
      }
    ]
  },
  {
    productId: "bag",
    sides: [
      {
        sideId: "front",
        imageUrl: "/ProductImages/YellowSac.png"
      }
    ]
  }
];
