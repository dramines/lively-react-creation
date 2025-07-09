
export const getProductImage = (imgProduct?: string, reference?: string): string => {
  // If we have an image URL, use it
  if (imgProduct && imgProduct.trim() !== '') {
    // Handle both relative and absolute URLs
    if (imgProduct.startsWith('http')) {
      return imgProduct;
    } else {
      return `https://draminesaid.com/lucci/${imgProduct}`;
    }
  }
  
  // Fallback to default image
  return '/lovable-uploads/1e127b10-9a18-47a3-b8df-ff0d939224ba.png';
};
