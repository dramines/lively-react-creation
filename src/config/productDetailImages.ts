
export interface ProductDetailImages {
  productId: string;
  images: string[];
}

export const productDetailImages: ProductDetailImages[] = [
  {
    productId: "veste-cuisine-1",
    images: [
     "/CommingSoon.png",
     "/CommingSoon.png",     
     "/CommingSoon.png"
        ]
  },
  {
    productId: "tablier-cuisine-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },

  // Vêtements Boucher
  {
    productId: "veste-boucher-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },
  {
    productId: "tablier-boucher-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },

  // Vêtements Médicaux
  {
    productId: "blouse-medicale-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },
  {
    productId: "pantalon-medical-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },

  // Vêtements Hôtellerie
  {
    productId: "veste-hotel-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },
  {
    productId: "tablier-hotel-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },

  // Vêtements de Travail
  {
    productId: "combinaison-travail-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },
  {
    productId: "veste-travail-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },

  // Chaussures de Sécurité
  {
    productId: "chaussures-securite-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },
  {
    productId: "bottes-securite-1",
    images: [
      "/CommingSoon.png",
      "/CommingSoon.png",     
      "/CommingSoon.png"
         ]
  },

  // Marketing Products
  {
    productId: "mug-1",
    images: [
      "/ProductImages/BlackMug.png",
      "/ProductImages/BlackMug.png",
      "/ProductImages/BlackMug.png"
    ]
  },
  {
    productId: "notebook-1",
    images: [
      "/ProductImages/WhiteNotebook.png",
      "/ProductImages/WhiteNotebook.png",
      "/ProductImages/WhiteNotebook.png"
    ]
  },
  {
    productId: "flag-1",
    images: [
      "/ProductImages/RedMarketingFlag.png",
      "/ProductImages/RedMarketingFlag.png",
      "/ProductImages/RedMarketingFlag.png"
    ]
  },
  {
    productId: "bag-1",
    images: [
      "/ProductImages/YellowSac.png",
      "/ProductImages/YellowSac.png",
      "/ProductImages/YellowSac.png"
    ]
  }
];

export const getProductImages = (productId: string): string[] => {
  const product = productDetailImages.find(p => p.productId === productId);
  return product?.images || [];
};
