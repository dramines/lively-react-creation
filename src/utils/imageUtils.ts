// Utility function to get random product images from uploaded files
const uploadedImages = [
  '/lovable-uploads/1e127b10-9a18-47a3-b8df-ff0d939224ba.png',
  '/lovable-uploads/2842003f-8573-41de-8f49-c3331a6aa59b.png',
  '/lovable-uploads/826629d2-edfb-4f7e-b1fb-e35e63dbe15c.png',
  '/lovable-uploads/b89b1719-64f0-4f92-bbdb-cfb07951073a.png',
  '/lovable-uploads/d9a0c61e-6c3a-4b3f-97f1-f33909cbcbf9.png',
  '/lovable-uploads/e90f106d-bad2-4727-bca1-71c55539ba19.png'
];

export const getRandomProductImage = (productId?: string) => {
  // Use product ID as seed for consistent random selection per product
  const seed = productId ? parseInt(productId) || 0 : Math.floor(Math.random() * uploadedImages.length);
  return uploadedImages[seed % uploadedImages.length];
};

export const getProductImage = (originalImage: string, productId?: string) => {
  // If original image is null, empty, or placeholder, use random uploaded image
  if (!originalImage || originalImage === 'null' || originalImage === '/placeholder.svg' || originalImage.includes('placeholder')) {
    return getRandomProductImage(productId);
  }
  
  // If it's already a full URL (starts with http or https), return as is
  if (originalImage.startsWith('http')) {
    return originalImage;
  }
  
  // If it's a Lovable upload, return as is
  if (originalImage.startsWith('/lovable-uploads/')) {
    return originalImage;
  }
  
  // For all API images, construct the full URL with the server path
  // Remove any leading slash to avoid double slashes
  const cleanPath = originalImage.startsWith('/') ? originalImage.substring(1) : originalImage;
  
  // If it already starts with 'uploads/', use it directly
  if (cleanPath.startsWith('uploads/')) {
    return `https://draminesaid.com/lucci/${cleanPath}`;
  }
  
  // Otherwise, assume it needs the uploads/ prefix
  return `https://draminesaid.com/lucci/uploads/${cleanPath}`;
};
